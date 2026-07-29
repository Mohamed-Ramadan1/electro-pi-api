import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from './entity/task.entity';
import { TaskImage } from './entity/task-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskImage])],
})
export class TasksModule {}
