import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskRepository } from '../repo/task.repo';
import { UploaderService } from '@infrastructure/index';
import { User } from '@modules/users/entity/user.entity';
import { Project } from '@modules/projects/entity/project.entity';
import { TaskImage } from '../entity/task-image.entity';
import { TasksPriority } from '../constants/taskst.const';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { UpdateTaskStatusDto } from '../dto/update-task-status.dto';
import { Task } from '../entity/task.entity';

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly taskRepo: TaskRepository,
    private readonly uploaderService: UploaderService,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  private async resolveTaskImageUrls(task: Task | null): Promise<Task | null> {
    if (!task?.images?.length) return task;
    task.images = await Promise.all(
      task.images.map(async (img) => {
        img.url = (await this.uploaderService.getSignedUrl(img.key)) ?? '';
        return img;
      }),
    );
    return task;
  }

  private async loadProjectWithMembers(projectId: string): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: { creator: true, members: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  private isProjectMember(project: Project, userId: string): boolean {
    return (
      project.creator.id === userId ||
      project.members.some((m) => m.id === userId)
    );
  }

  private async ensureProjectAccess(userId: string, task: Task): Promise<void> {
    const project = await this.loadProjectWithMembers(task.project.id);

    if (!this.isProjectMember(project, userId)) {
      throw new ForbiddenException(
        'You do not have access to modify tasks in this project',
      );
    }
  }

  private async validateProjectMembership(
    projectId: string,
    userId: string,
  ): Promise<Project> {
    const project = await this.loadProjectWithMembers(projectId);

    if (!this.isProjectMember(project, userId)) {
      throw new ForbiddenException(
        'You can only create tasks on projects you belong to',
      );
    }

    return project;
  }

  private validateAssignable(project: Project, assigneeId: string): void {
    if (!this.isProjectMember(project, assigneeId)) {
      throw new ForbiddenException(
        'Cannot assign task to a user who is not a member of this project',
      );
    }
  }

  async createTask(
    dto: CreateTaskDto,
    creatorId: string,
    files?: UploadedFile[],
  ) {
    const project = await this.validateProjectMembership(
      dto.projectId,
      creatorId,
    );

    if (dto.assigneeId) {
      this.validateAssignable(project, dto.assigneeId);
    }

    const images: Partial<TaskImage>[] = [];

    if (files?.length) {
      for (const file of files) {
        try {
          const { url, key } = await this.uploaderService.uploadResource(
            file,
            'task-images',
          );
          images.push({ url, key });
        } catch (err) {
          this.logger.error(
            `Failed to upload task image: ${(err as Error).message}`,
          );
        }
      }
    }

    const task = await this.taskRepo.create({
      title: dto.title,
      description: dto.description ?? null,
      priority: (dto.priority as TasksPriority) ?? undefined,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      project: { id: dto.projectId } as Project,
      creator: { id: creatorId } as User,
      assignee: dto.assigneeId ? ({ id: dto.assigneeId } as User) : null,
      images: images as TaskImage[],
    });

    return this.resolveTaskImageUrls(task);
  }

  async findAll(userId: string) {
    const tasks = await this.taskRepo.findByUser(userId);
    await Promise.all(tasks.map((t) => this.resolveTaskImageUrls(t)));
    return tasks;
  }

  async findByProject(projectId: string, userId: string) {
    const tasks = await this.taskRepo.findByProject(projectId);
    const filtered = tasks.filter(
      (t) => t.creator.id === userId || t.assignee?.id === userId,
    );
    await Promise.all(filtered.map((t) => this.resolveTaskImageUrls(t)));
    return filtered;
  }

  async findOne(id: string) {
    const task = await this.taskRepo.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return this.resolveTaskImageUrls(task);
  }

  async assignTask(id: string, assigneeId: string, userId: string) {
    const task = await this.taskRepo.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.ensureProjectAccess(userId, task);

    const project = await this.loadProjectWithMembers(task.project.id);
    this.validateAssignable(project, assigneeId);

    task.assignee = { id: assigneeId } as User;
    await this.taskRepo.save(task);
    const updated = await this.taskRepo.findById(id);
    return this.resolveTaskImageUrls(updated);
  }

  async unassignTask(id: string, userId: string) {
    const task = await this.taskRepo.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.ensureProjectAccess(userId, task);

    task.assignee = null;
    await this.taskRepo.save(task);
    const updated = await this.taskRepo.findById(id);
    return this.resolveTaskImageUrls(updated);
  }

  async selfAssignTask(id: string, userId: string) {
    const task = await this.taskRepo.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const project = await this.loadProjectWithMembers(task.project.id);

    if (!this.isProjectMember(project, userId)) {
      throw new ForbiddenException(
        'You must be a member of this project to claim tasks',
      );
    }

    task.assignee = { id: userId } as User;
    await this.taskRepo.save(task);
    const updated = await this.taskRepo.findById(id);
    return this.resolveTaskImageUrls(updated);
  }

  async selfUnassignTask(id: string, userId: string) {
    const task = await this.taskRepo.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.assignee?.id !== userId) {
      throw new ForbiddenException(
        'You can only release tasks that are assigned to you',
      );
    }

    task.assignee = null;
    await this.taskRepo.save(task);
    const updated = await this.taskRepo.findById(id);
    return this.resolveTaskImageUrls(updated);
  }

  async updateTask(
    id: string,
    userId: string,
    dto: UpdateTaskDto,
    files?: UploadedFile[],
  ) {
    const task = await this.taskRepo.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.ensureProjectAccess(userId, task);

    if (dto.assigneeId !== undefined && dto.assigneeId) {
      const project = await this.loadProjectWithMembers(task.project.id);
      this.validateAssignable(project, dto.assigneeId);
    }

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) {
      task.status = dto.status as any;
      if (dto.status === 'done') {
        task.completedAt = new Date();
      } else {
        task.completedAt = null;
      }
    }
    if (dto.priority !== undefined) task.priority = dto.priority as any;
    if (dto.dueDate !== undefined) {
      task.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    }
    if (dto.assigneeId !== undefined) {
      task.assignee = dto.assigneeId ? ({ id: dto.assigneeId } as User) : null;
    }

    if (files?.length) {
      for (const file of files) {
        try {
          const { url, key } = await this.uploaderService.uploadResource(
            file,
            'task-images',
          );
          task.images.push({ url, key } as TaskImage);
        } catch (err) {
          this.logger.error(
            `Failed to upload task image: ${(err as Error).message}`,
          );
        }
      }
    }

    await this.taskRepo.save(task);
    const updated = await this.taskRepo.findById(id);
    return this.resolveTaskImageUrls(updated);
  }

  async updateTaskStatus(id: string, userId: string, dto: UpdateTaskStatusDto) {
    const task = await this.taskRepo.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const isAssignee = task.assignee?.id === userId;

    if (!isAssignee) {
      const project = await this.loadProjectWithMembers(task.project.id);

      if (!this.isProjectMember(project, userId)) {
        throw new NotFoundException('Task not found or not assigned to you');
      }
    }

    task.status = dto.status as any;
    if (dto.status === 'done') {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await this.taskRepo.save(task);
    const updated = await this.taskRepo.findById(id);
    return this.resolveTaskImageUrls(updated);
  }

  async deleteTask(id: string, userId: string) {
    const task = await this.taskRepo.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.ensureProjectAccess(userId, task);

    if (task.images?.length) {
      for (const image of task.images) {
        await this.uploaderService.deleteResource(image.key).catch((err) => {
          this.logger.error(
            `Failed to delete task image: ${(err as Error).message}`,
          );
        });
      }
    }

    await this.taskRepo.delete(id);
  }
}
