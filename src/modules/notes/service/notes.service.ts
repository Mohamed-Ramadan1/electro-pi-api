// nest module imports
import { Injectable } from '@nestjs/common';

// repository  imports
import { NotesRepository } from '../repo/notes.repo';

// DTO imports
import { CreateNoteDto } from '../dto/createNote.dto';
import { UpdateNoteDto } from '../dto/updateNote.dto';

// entity imports.
import { Notes } from '../entity/notes.entity';

// infrastructure imports
import { UploaderService } from '@infrastructure/index';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepo: NotesRepository) {}
  async createNote(
    createNoteDto: CreateNoteDto,
    file?: Express.Multer.File,
  ): Promise<Notes> {
    return this.notesRepo.create(createNoteDto);
  }

  getNote(id: string): Promise<Notes | null> {
    return this.notesRepo.findById(id);
  }

  getNotes(): Promise<Notes[]> {
    return this.notesRepo.findAll();
  }

  updateNote(
    id: string,
    updateNoteDto: UpdateNoteDto,
    file?: Express.Multer.File,
  ): Promise<Notes> {
    return this.notesRepo.update(id, updateNoteDto);
  }

  deleteNote(id: string): Promise<void> {
    return this.notesRepo.delete(id);
  }

  activateNote(id: string): Promise<Notes> {
    return this.notesRepo.activate(id);
  }

  deactivateNote(id: string): Promise<Notes> {
    return this.notesRepo.deactivate(id);
  }
}
