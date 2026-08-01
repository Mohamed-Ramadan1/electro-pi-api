import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  UseInterceptors,
  Body,
  Param,
  HttpStatus,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';

// services imports
import { NotesService } from '../service/notes.service';

// dto imports
import { CreateNoteDto } from '../dto/createNote.dto';
import { UpdateNoteDto } from '../dto/updateNote.dto';

// common imports
import {
  TransformResponseInterceptor,
  Protected,
  FileSizeValidationPipe,
} from '@common/index';

@ApiTags('Notes')
@ApiBearerAuth()
@Controller('notes')
@Protected()
@UseInterceptors(TransformResponseInterceptor)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ summary: 'Get a single note' })
  @ApiParam({ name: 'id', description: 'Note UUID', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Note retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @Get(':id')
  async getNote(@Param('id') id: string) {
    const note = await this.notesService.getNote(id);
    return {
      message: 'note retrieved successfully.',
      data: note,
    };
  }

  @ApiOperation({ summary: 'List all notes for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Notes retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getNotes() {
    const notes = await this.notesService.getNotes();
    return {
      message: 'notes retrieved successfully.',
      data: notes,
    };
  }

  @ApiOperation({ summary: 'Create a new note' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Note created successfully.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @UploadedFile(new FileSizeValidationPipe()) file?: Express.Multer.File,
  ) {
    const note = await this.notesService.createNote(createNoteDto, file);
    return {
      message: 'note created successfully.',
      data: note,
    };
  }

  @ApiOperation({ summary: 'Update a note' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'Note UUID', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Note updated successfully.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @UploadedFile(new FileSizeValidationPipe()) file?: Express.Multer.File,
  ) {
    const note = await this.notesService.updateNote(id, updateNoteDto, file);
    return {
      message: 'note updated successfully.',
      data: note,
    };
  }

  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({ name: 'id', description: 'Note UUID', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Note deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteNote(@Param('id') id: string) {
    await this.notesService.deleteNote(id);
    return {
      message: 'note deleted successfully.',
    };
  }

  @ApiOperation({ summary: 'Activate a note' })
  @ApiParam({ name: 'id', description: 'Note UUID', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Note activated successfully.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/activate')
  async activateNote(@Param('id') id: string) {
    const note = await this.notesService.activateNote(id);
    return {
      message: 'note activated successfully.',
      data: note,
    };
  }

  @ApiOperation({ summary: 'Deactivate a note' })
  @ApiParam({ name: 'id', description: 'Note UUID', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Note deactivated successfully.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/deactivate')
  async deactivateNote(@Param('id') id: string) {
    const note = await this.notesService.deactivateNote(id);
    return {
      message: 'note deactivated successfully.',
      data: note,
    };
  }
}
