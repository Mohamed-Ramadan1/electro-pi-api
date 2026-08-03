import { Injectable, Logger } from '@nestjs/common';

import { NotesRepository } from '../repo/notes.repo';

import { CreateNoteType } from '../types/createNote.type';
import { CreateNoteDto } from '../dto/createNote.dto';
import { UpdateNoteDto } from '../dto/updateNote.dto';

import { Notes } from '../entity/notes.entity';

import { UploaderService } from '@infrastructure/index';

import { UploadedFile } from '@common/index';

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);
  private readonly uploadFolderName = 'notes';

  constructor(
    private readonly notesRepo: NotesRepository,
    private readonly uploaderService: UploaderService,
  ) {}

  private async resolveImageUrl(note: Notes): Promise<void> {
    note.imageUrl = await this.uploaderService.getSignedUrl(note.imageKey);
  }

  private async resolveImageUrls(notes: Notes[]): Promise<void> {
    await Promise.all(notes.map((n) => this.resolveImageUrl(n)));
  }

  async createNote(
    noteData: CreateNoteDto,
    userId: string,
    file?: UploadedFile,
  ): Promise<Notes> {
    const note: CreateNoteType = {
      title: noteData.title,
      content: noteData.content,
      userId,
    };

    if (file) {
      try {
        const { key } = await this.uploaderService.uploadResource(
          file,
          this.uploadFolderName,
        );
        note.imageKey = key;
      } catch (err) {
        this.logger.error(
          `Failed to upload note image: ${(err as Error).message}`,
        );
      }
    }

    const created = await this.notesRepo.create(note, userId);
    await this.resolveImageUrl(created);
    return created;
  }

  async getNote(id: string, userId: string): Promise<Notes | null> {
    const note = await this.notesRepo.findById(id, userId);
    if (note) {
      await this.resolveImageUrl(note);
    }
    return note;
  }

  async getNotes(userId: string): Promise<Notes[]> {
    const notes = await this.notesRepo.findAll(userId);
    await this.resolveImageUrls(notes);
    return notes;
  }

  async updateNote(
    id: string,
    updateNoteDto: UpdateNoteDto,
    userId: string,
    file?: UploadedFile,
  ): Promise<Notes> {
    const note: Partial<CreateNoteType> = { ...updateNoteDto };

    if (file) {
      try {
        const { key } = await this.uploaderService.uploadResource(
          file,
          this.uploadFolderName,
        );
        note.imageKey = key;
      } catch (err) {
        this.logger.error(
          `Failed to upload note image: ${(err as Error).message}`,
        );
      }
    }

    const updated = await this.notesRepo.update(id, note, userId);
    await this.resolveImageUrl(updated);
    return updated;
  }

  async deleteNote(id: string, userId: string): Promise<void> {
    return this.notesRepo.delete(id, userId);
  }

  async activateNote(id: string, userId: string): Promise<Notes> {
    const note = await this.notesRepo.activate(id, userId);
    await this.resolveImageUrl(note);
    return note;
  }

  async deactivateNote(id: string, userId: string): Promise<Notes> {
    const note = await this.notesRepo.deactivate(id, userId);
    await this.resolveImageUrl(note);
    return note;
  }
}
