import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from './entity/project.entity';
import { User } from '@modules/users/entity/user.entity';

import { ProjectsMembersController } from './controller/projects-members.controller';
import { ProjectsController } from './controller/projects.controller';

import { ProjectsService } from './services/projects.service';
import { ProjectRepository } from './repo/project.repo';

import { UploadModule } from '@infrastructure/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User]), UploadModule],
  controllers: [ProjectsController, ProjectsMembersController],
  providers: [ProjectsService, ProjectRepository],
})
export class ProjectsModule {}
