import { Module } from '@nestjs/common';

// Controllers
import { RemindersController } from './controller/reminders.controller';

// Services imports
import { RemindersService } from './service/reminders.service';

// repos
import { ReminderRepository } from './repo/reminders.repo';

// Entity
import { Reminder } from './entity/reminder.entity';

import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder])],
  providers: [ReminderRepository, RemindersService],
  controllers: [RemindersController],
})
export class RemindersModule {}
