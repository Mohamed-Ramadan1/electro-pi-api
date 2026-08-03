import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ProjectRepository } from '../repo/project.repo';
import { UploaderService } from '@infrastructure/index';
import { User } from '@modules/users/entity/user.entity';
import { Project } from '../entity/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';

//common imports
import { UploadedFile } from '@common/index';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    private readonly projectRepo: ProjectRepository,
    private readonly uploaderService: UploaderService,
  ) {}

  private async resolveProjectImageUrl(
    imageKey: string | null,
  ): Promise<string | null> {
    return this.uploaderService.getSignedUrl(imageKey);
  }

  private async mapProjectImage(project: Project | null): Promise<void> {
    if (!project) return;
    project.projectImage = await this.resolveProjectImageUrl(
      project.projectImage,
    );
  }

  async createProject(
    dto: CreateProjectDto,
    creatorId: string,
    file?: UploadedFile,
  ) {
    const existing = await this.projectRepo.findByName(dto.name);
    if (existing) {
      throw new ConflictException('A project with this name already exists');
    }

    let projectImage: string | null = null;

    if (file) {
      try {
        const { key } = await this.uploaderService.uploadResource(
          file,
          'project-covers',
        );
        projectImage = key;
      } catch (err) {
        this.logger.error(
          `Failed to upload project image: ${(err as Error).message}`,
        );
      }
    }

    const memberIds = Array.from(new Set([creatorId, ...(dto.members ?? [])]));

    return this.projectRepo.create({
      name: dto.name,
      description: dto.description ?? null,
      projectImage,
      creator: { id: creatorId } as User,
      members: memberIds.map((id) => ({ id }) as User),
    });
  }

  async findAll(userId: string) {
    const projects = await this.projectRepo.findByUser(userId);
    await Promise.all(projects.map((p) => this.mapProjectImage(p)));
    return projects;
  }

  async findOne(id: string, userId: string) {
    const project = await this.projectRepo.findByIdAndUser(id, userId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    await this.mapProjectImage(project);
    return project;
  }

  async deleteProject(id: string) {
    const project = await this.projectRepo.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    await this.projectRepo.delete(id);
  }

  async addMember(projectId: string, userId: string) {
    const project = await this.projectRepo.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isMember = project.members.some((m) => m.id === userId);
    if (isMember) {
      throw new ConflictException('User is already a member of this project');
    }

    project.members.push({ id: userId } as User);
    await this.projectRepo.save(project);

    const updated = await this.projectRepo.findById(projectId);
    await this.mapProjectImage(updated);
    return updated;
  }

  async removeMember(projectId: string, userId: string) {
    const project = await this.projectRepo.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.members = project.members.filter((m) => m.id !== userId);
    await this.projectRepo.save(project);

    const updated = await this.projectRepo.findById(projectId);
    await this.mapProjectImage(updated);
    return updated;
  }

  async closeProject(id: string) {
    const project = await this.projectRepo.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepo.updateStatus(id, 'closed');

    const updated = await this.projectRepo.findById(id);
    await this.mapProjectImage(updated);
    return updated;
  }

  async reopenProject(id: string) {
    const project = await this.projectRepo.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepo.updateStatus(id, 'open');

    const updated = await this.projectRepo.findById(id);
    await this.mapProjectImage(updated);
    return updated;
  }
}
