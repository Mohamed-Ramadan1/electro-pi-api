import { Injectable } from '@nestjs/common';

// Repository import
import { ReminderRepository } from '../repo/reminders.repo';
@Injectable()
export class RemindersService {
  constructor(private readonly reminderRepo: ReminderRepository) {}

  getReminders() {}

  getReminder() {}

  createReminder() {}

  deleteReminders() {}

  updateReminder() {}

  rescheduleReminder() {}

  toggleReminder() {}

  snoozeReminder() {}

  getUpcomingReminders() {}

  acknowledgeReminder() {}
}
