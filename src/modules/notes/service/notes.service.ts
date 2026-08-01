import { Injectable } from '@nestjs/common';
import { NotesRepository } from '../repo/notes.repo';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}
  createNote() {}
  getNote() {}
  getNotes() {}
  updateNote() {}
  deleteNote() {}
  activateNote() {}
  deactivateNote() {}
}
