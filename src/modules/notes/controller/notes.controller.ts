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
  Req,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';

// services imports
import { NotesService } from '../service/notes.service';

// dto imports
import { CreateNoteDto } from '../dto/createNote.dto';
import { UpdateNoteDto } from '../dto/updateNote.dto';
import { NoteResponseDto } from '../dto/noteResponse.dto';

// common imports
import {
  TransformResponseInterceptor,
  Protected,
  FileSizeValidationPipe,
} from '@common/index';

@ApiTags('Notes')
@ApiBearerAuth()
@ApiExtraModels(NoteResponseDto)
@Controller('notes')
@Protected()
@UseInterceptors(TransformResponseInterceptor)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ summary: 'Get a single note' })
  @ApiParam({ name: 'id', description: 'Note UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Note retrieved successfully.',
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @Get(':id')
  async getNote(@Param('id') id: string, @Req() req: Request) {
    const note = await this.notesService.getNote(id, req.user.id);
    return {
      message: 'note retrieved successfully.',
      data: note,
    };
  }

  @ApiOperation({ summary: 'List all notes for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Notes retrieved successfully.',
    type: [NoteResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getNotes(@Req() req: Request) {
    const notes = await this.notesService.getNotes(req.user.id);
    return {
      message: 'notes retrieved successfully.',
      data: notes,
    };
  }

  @ApiOperation({ summary: 'Create a new note' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Note data with optional image file',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Note title',
          example: 'Meeting notes',
        },
        content: {
          type: 'string',
          description: 'Note content (optional)',
          example: 'Discussed project timeline and deliverables.',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Optional image file to attach',
        },
      },
      required: ['title'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Note created successfully.',
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async createNote(
    @Req() req: Request,
    @Body() createNoteDto: CreateNoteDto,
    @UploadedFile(new FileSizeValidationPipe())
    file?: { buffer: Buffer; originalname: string; mimetype: string },
  ) {
    const note = await this.notesService.createNote(
      createNoteDto,
      req.user.id,
      file,
    );
    return {
      message: 'note created successfully.',
      data: note,
    };
  }

  @ApiOperation({ summary: 'Update a note' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'Note UUID', format: 'uuid' })
  @ApiBody({
    description: 'Fields to update with optional new image file',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'New note title (optional)',
          example: 'Updated meeting notes',
        },
        content: {
          type: 'string',
          description: 'New note content (optional)',
          example: 'Updated discussion points.',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Optional new image file to replace existing',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Note updated successfully.',
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() req: Request,
    @UploadedFile(new FileSizeValidationPipe())
    file?: { buffer: Buffer; originalname: string; mimetype: string },
  ) {
    const note = await this.notesService.updateNote(
      id,
      updateNoteDto,
      req.user.id,
      file,
    );
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
  async deleteNote(@Param('id') id: string, @Req() req: Request) {
    await this.notesService.deleteNote(id, req.user.id);
    return {
      message: 'note deleted successfully.',
    };
  }

  @ApiOperation({ summary: 'Activate a note' })
  @ApiParam({ name: 'id', description: 'Note UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Note activated successfully.',
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/activate')
  async activateNote(@Param('id') id: string, @Req() req: Request) {
    const note = await this.notesService.activateNote(id, req.user.id);
    return {
      message: 'note activated successfully.',
      data: note,
    };
  }

  @ApiOperation({ summary: 'Deactivate a note' })
  @ApiParam({ name: 'id', description: 'Note UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Note deactivated successfully.',
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/deactivate')
  async deactivateNote(@Param('id') id: string, @Req() req: Request) {
    const note = await this.notesService.deactivateNote(id, req.user.id);
    return {
      message: 'note deactivated successfully.',
      data: note,
    };
  }
}
