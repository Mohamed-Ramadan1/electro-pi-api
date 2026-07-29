import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entity/project.entity';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly repo: Repository<Project>,
  ) {}

  async create(project: Partial<Project>): Promise<Project> {
    const saved = await this.repo.save(this.repo.create(project));
    return this.repo.findOneOrFail({
      where: { id: saved.id },
      relations: { creator: true, members: true },
    });
  }

  find(): Promise<Project[]> {
    return this.repo.find({ relations: { creator: true, members: true } });
  }

  findByUser(userId: string): Promise<Project[]> {
    return this.repo.find({
      where: [{ creator: { id: userId } }, { members: { id: userId } }],
      relations: { creator: true, members: true },
    });
  }

  findById(id: string): Promise<Project | null> {
    return this.repo.findOne({
      where: { id },
      relations: { creator: true, members: true },
    });
  }

  findByIdAndUser(id: string, userId: string): Promise<Project | null> {
    return this.repo.findOne({
      where: [
        { id, creator: { id: userId } },
        { id, members: { id: userId } },
      ],
      relations: { creator: true, members: true },
    });
  }

  findByName(name: string): Promise<Project | null> {
    return this.repo.findOneBy({ name });
  }

  save(project: Project): Promise<Project> {
    return this.repo.save(project);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.repo.update(id, { projectStatus: status } as Partial<Project>);
  }
}
