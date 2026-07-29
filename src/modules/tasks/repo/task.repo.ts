import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entity/task.entity';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
  ) {}

  async create(task: Partial<Task>): Promise<Task> {
    const saved = await this.repo.save(this.repo.create(task));
    return this.repo.findOneOrFail({
      where: { id: saved.id },
      relations: {
        creator: true,
        assignee: true,
        project: true,
        images: true,
      },
    });
  }

  find(): Promise<Task[]> {
    return this.repo.find({
      relations: {
        creator: true,
        assignee: true,
        project: true,
        images: true,
      },
    });
  }

  findById(id: string): Promise<Task | null> {
    return this.repo.findOne({
      where: { id },
      relations: {
        creator: true,
        assignee: true,
        project: true,
        images: true,
      },
    });
  }

  findByUser(userId: string): Promise<Task[]> {
    return this.repo.find({
      where: [{ creator: { id: userId } }, { assignee: { id: userId } }],
      relations: {
        creator: true,
        assignee: true,
        project: true,
        images: true,
      },
    });
  }

  findByProject(projectId: string): Promise<Task[]> {
    return this.repo.find({
      where: { project: { id: projectId } },
      relations: {
        creator: true,
        assignee: true,
        project: true,
        images: true,
      },
    });
  }

  findByIdAndUser(id: string, userId: string): Promise<Task | null> {
    return this.repo.findOne({
      where: [
        { id, creator: { id: userId } },
        { id, assignee: { id: userId } },
      ],
      relations: {
        creator: true,
        assignee: true,
        project: true,
        images: true,
      },
    });
  }

  save(task: Task): Promise<Task> {
    return this.repo.save(task);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
