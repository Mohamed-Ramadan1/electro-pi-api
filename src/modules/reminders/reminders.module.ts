import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueuesModule } from '@infrastructure/queues/queues.module';

// Controllers
import { RemindersController } from './controller/reminders.controller';

// Services imports
import { RemindersService } from './service/reminders.service';

// repos
import { ReminderRepository } from './repo/reminders.repo';

// Entity
import { Reminder } from './entity/reminder.entity';

import { ReminderProcessor } from './processors/reminders.processor';
import { NotificationsModule } from '@modules/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reminder]),
    QueuesModule,
    NotificationsModule,
  ],
  providers: [ReminderRepository, RemindersService, ReminderProcessor],
  controllers: [RemindersController],
})
export class RemindersModule {}
