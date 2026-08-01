import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notes } from './entity/notes.entity';

import { NotesController } from './controller/notes.controller';
import { NotesService } from './service/notes.service';
import { NotesRepository } from './repo/notes.repo';

@Module({
  imports: [TypeOrmModule.forFeature([Notes])],
  controllers: [NotesController],
  providers: [NotesService, NotesRepository],
})
export class NotesModule {}
