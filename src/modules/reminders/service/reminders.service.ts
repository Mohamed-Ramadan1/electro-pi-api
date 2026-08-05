import { Injectable } from '@nestjs/common';
import { DeleteResult } from 'typeorm';

// Repository import
import { ReminderRepository } from '../repo/reminders.repo';

// entity imports
import { Reminder } from '../entity/reminder.entity';

// dto imports.
import { CreateReminderDto } from '../dto/create-reminder.dto';
import { UpdateReminderDto } from '../dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(private readonly reminderRepo: ReminderRepository) {}

  getReminders(userId: string): Promise<Reminder[]> {
    return this.reminderRepo.findAll(userId);
  }

  getReminder(userId: string, reminderId: string): Promise<Reminder> {
    return this.reminderRepo.findById(userId, reminderId);
  }

  createReminder(
    userId: string,
    reminderData: CreateReminderDto,
  ): Promise<Reminder> {
    return this.reminderRepo.create(userId, reminderData);
  }

  deleteReminders(userId: string): Promise<DeleteResult> {
    return this.reminderRepo.deleteAll(userId);
  }

  deleteReminder(userId: string, reminderId: string): Promise<DeleteResult> {
    return this.reminderRepo.deleteById(userId, reminderId);
  }

  updateReminder(
    userId: string,
    reminderId: string,
    updateReminderData: UpdateReminderDto,
  ): Promise<Reminder> {
    return this.reminderRepo.update(userId, reminderId, updateReminderData);
  }

  rescheduleReminder() {}

  toggleReminder() {}

  snoozeReminder() {}

  getUpcomingReminders() {}

  acknowledgeReminder() {}
}
