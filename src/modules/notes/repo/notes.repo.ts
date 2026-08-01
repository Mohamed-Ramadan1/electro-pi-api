// nest module imports.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// external module imports.
import { Repository } from 'typeorm';

// entity imports.
import { Notes } from '../entity/notes.entity';

@Injectable()
export class NotesRepository {
  constructor(
    @InjectRepository(Notes)
    private readonly repo: Repository<Notes>,
  ) {}
  async create(createNoteDto: any): Promise<Notes> {
    const note = this.repo.create(createNoteDto);
    const [saved] = await this.repo.save(note);
    return saved;
  }

  async findById(id: string): Promise<Notes | null> {
    const note = this.repo.findOneByOrFail({
      id,
    });
    return note;
  }
  async findAll(): Promise<Notes[]> {
    const notes = this.repo.find();
    return notes;
  }
  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
  async update(id: string, updateNoteDto: any): Promise<Notes> {
    const note = await this.repo.findOneByOrFail({
      id,
    });
    this.repo.merge(note, updateNoteDto);
    return this.repo.save(note);
  }

  async activate(id: string): Promise<Notes> {
    this.repo.update({ id }, { isActive: true });
    const note = await this.repo.findOneByOrFail({
      id,
    });
    return note;
  }
  async deactivate(id: string): Promise<Notes> {
    this.repo.update({ id }, { isActive: false });
    const note = await this.repo.findOneByOrFail({
      id,
    });
    return note;
  }
}
