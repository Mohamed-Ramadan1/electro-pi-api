import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { ProjectsModule } from './projects/projects.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TasksModule } from './tasks/tasks.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotesModule } from './notes/notes.module';
import { RemindersModule } from './reminders/reminders.module';
import { TeamsModule } from './teams/teams.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TasksModule,
    NotificationsModule,
    ProjectsModule,
    DashboardModule,
    NotesModule,
    RemindersModule,
    TeamsModule,
    EventsModule,
  ],
})
export class ModulesModule {}
