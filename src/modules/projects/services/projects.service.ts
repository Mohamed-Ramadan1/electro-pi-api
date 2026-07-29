import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ProjectRepository } from '../repo/project.repo';
import { UploaderService } from '@infrastructure/index';
import { User } from '@modules/users/entity/user.entity';
import { CreateProjectDto } from '../dto/create-project.dto';

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    private readonly projectRepo: ProjectRepository,
    private readonly uploaderService: UploaderService,
  ) {}

  async createProject(
    dto: CreateProjectDto,
    creatorId: string,
    file?: UploadedFile,
  ) {
    console.log('[ProjectsService] createProject called');
    console.log('[ProjectsService] dto:', JSON.stringify(dto));
    console.log('[ProjectsService] creatorId:', creatorId);
    console.log(
      '[ProjectsService] file:',
      file ? `${file.originalname} (${file.buffer.length}b)` : 'NONE',
    );

    const existing = await this.projectRepo.findByName(dto.name);
    if (existing) {
      console.log('[ProjectsService] CONFLICT: name already exists');
      throw new ConflictException('A project with this name already exists');
    }

    let projectImage: string | null = null;

    if (file) {
      try {
        console.log('[ProjectsService] Uploading to S3...');
        const { url } = await this.uploaderService.uploadResource(
          file,
          'project-covers',
        );
        projectImage = url;
        console.log('[ProjectsService] Upload SUCCESS. URL:', url);
      } catch (err) {
        console.log('[ProjectsService] Upload FAILED:', (err as Error).message);
        this.logger.error(
          `Failed to upload project image: ${(err as Error).message}`,
        );
      }
    }

    console.log(
      '[ProjectsService] Saving project to DB. projectImage:',
      projectImage,
    );

    return this.projectRepo.create({
      name: dto.name,
      description: dto.description ?? null,
      projectImage,
      creator: { id: creatorId } as User,
      members: (dto.members ?? []).map((id) => ({ id }) as User),
    });
  }

  findAll(userId: string) {
    return this.projectRepo.findByUser(userId);
  }

  async findOne(id: string, userId: string) {
    const project = await this.projectRepo.findByIdAndUser(id, userId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
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

    return this.projectRepo.findById(projectId);
  }

  async removeMember(projectId: string, userId: string) {
    const project = await this.projectRepo.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.members = project.members.filter((m) => m.id !== userId);
    await this.projectRepo.save(project);

    return this.projectRepo.findById(projectId);
  }

  async closeProject(id: string) {
    const project = await this.projectRepo.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepo.updateStatus(id, 'closed');

    return this.projectRepo.findById(id);
  }

  async reopenProject(id: string) {
    const project = await this.projectRepo.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepo.updateStatus(id, 'open');

    return this.projectRepo.findById(id);
  }
}
