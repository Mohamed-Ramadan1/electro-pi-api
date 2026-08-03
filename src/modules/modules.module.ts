import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { ProjectsModule } from './projects/projects.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TasksModule } from './tasks/tasks.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TasksModule,
    NotificationsModule,
    ProjectsModule,
    DashboardModule,
    NotesModule,
  ],
})
export class ModulesModule {}
