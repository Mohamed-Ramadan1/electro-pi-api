import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  UseInterceptors,
} from '@nestjs/common';

//services imports
import { NotesService } from '../service/notes.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

// common imports
import { TransformResponseInterceptor, Protected } from '@common/index';

@ApiTags('Notes')
@ApiBearerAuth()
@Controller('notes')
@Protected()
@UseInterceptors(TransformResponseInterceptor)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}
  @Get(':id')
  getNote() {}
  @Get()
  getNotes() {}
  @Post()
  createNote() {}
  @Patch(':id')
  updateNote() {}
  @Delete(':id')
  deleteNote() {}
  @Patch(':id/activate')
  activateNote() {}
  @Patch(':id/deactivate')
  deactivateNote() {}
}
