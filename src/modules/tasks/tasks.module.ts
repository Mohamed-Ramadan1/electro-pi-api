import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from './entity/task.entity';
import { TaskImage } from './entity/task-image.entity';
import { Project } from '@modules/projects/entity/project.entity';

import { TasksController } from './controller/tasks.controller';
import { TasksMembersController } from './controller/tasks-members.controller';

import { TasksService } from './services/tasks.service';
import { TaskRepository } from './repo/task.repo';

import { UploadModule } from '@infrastructure/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskImage, Project]), UploadModule],
  controllers: [TasksController, TasksMembersController],
  providers: [TasksService, TaskRepository],
})
export class TasksModule {}
