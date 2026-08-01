import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notes } from './entity/notes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notes])],
})
export class NotesModule {}
