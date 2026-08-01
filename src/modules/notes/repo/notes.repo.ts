// nest module imports.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// external module imports.
import { Repository } from 'typeorm';

// entity imports.
import { Notes } from '../entity/notes.entity';

// Types imports
import { CreateNoteType } from '../types/createNote.type';

@Injectable()
export class NotesRepository {
  constructor(
    @InjectRepository(Notes)
    private readonly repo: Repository<Notes>,
  ) {}
  async create(noteData: CreateNoteType, userId: string): Promise<Notes> {
    const note = this.repo.create({ ...noteData, user: { id: userId } });
    const saved = await this.repo.save(note);
    return saved;
  }

  async findById(id: string, userId: string): Promise<Notes | null> {
    const note = this.repo.findOneByOrFail({
      id,
      user: { id: userId },
    });
    return note;
  }
  async findAll(userId: string): Promise<Notes[]> {
    const notes = this.repo.find({
      where: { user: { id: userId } },
    });
    return notes;
  }
  async delete(id: string, userId: string): Promise<void> {
    await this.repo.delete({ id, user: { id: userId } });
  }
  async update(
    id: string,
    noteData: Partial<CreateNoteType>,
    userId: string,
  ): Promise<Notes> {
    const note = await this.repo.findOneByOrFail({
      id,
      user: { id: userId },
    });
    this.repo.merge(note, noteData);
    return this.repo.save(note);
  }

  async activate(id: string, userId: string): Promise<Notes> {
    this.repo.update({ id, user: { id: userId } }, { isActive: true });
    const note = await this.repo.findOneByOrFail({
      id,
      user: { id: userId },
    });
    return note;
  }
  async deactivate(id: string, userId: string): Promise<Notes> {
    this.repo.update({ id, user: { id: userId } }, { isActive: false });
    const note = await this.repo.findOneByOrFail({
      id,
      user: { id: userId },
    });
    return note;
  }
}
