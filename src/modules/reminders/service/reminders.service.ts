import { Injectable, NotFoundException } from '@nestjs/common';

// Repository import
import { ReminderRepository } from '../repo/reminders.repo';

// entity imports
import { Reminder } from '../entity/reminder.entity';

// dto imports.
import { CreateReminderDto } from '../dto/create-reminder.dto';
import { UpdateReminderDto } from '../dto/update-reminder.dto';
import { RescheduleReminderDto } from '../dto/reschedule-reminder.dto';
import { SnoozeReminderDto } from '../dto/snooze-reminder.dto';

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

  async deleteReminders(userId: string): Promise<void> {
    const result = await this.reminderRepo.deleteAll(userId);
    if (result.affected === 0) {
      throw new NotFoundException(`No reminders found for user ${userId}`);
    }
  }

  async deleteReminder(userId: string, reminderId: string): Promise<void> {
    const result = await this.reminderRepo.deleteById(userId, reminderId);
    if (result.affected === 0) {
      throw new NotFoundException(`No reminders found for user ${userId}`);
    }
  }

  updateReminder(
    userId: string,
    reminderId: string,
    updateReminderData: UpdateReminderDto,
  ): Promise<Reminder> {
    return this.reminderRepo.update(userId, reminderId, updateReminderData);
  }

  async rescheduleReminder(
    userId: string,
    reminderId: string,
    data: RescheduleReminderDto,
  ): Promise<void> {
    const result = await this.reminderRepo.reschedule(userId, reminderId, data);
    if (result.affected === 0) {
      throw new NotFoundException(
        'Reminder you tray to reschedule do not exist .',
      );
    }
  }

  async toggleReminder(userId: string, reminderId: string): Promise<Reminder> {
    return this.reminderRepo.toggleReminderStatus(userId, reminderId);
  }
  async snoozeReminder(
    userId: string,
    reminderId: string,
    data: SnoozeReminderDto,
  ): Promise<Reminder> {
    const result = await this.reminderRepo.snooze(
      userId,
      reminderId,
      data.snoozeInMinutes,
    );
    if (!result) {
      throw new NotFoundException('Reminder you try to snooze does not exist.');
    }
    return result;
  }

  getUpcomingReminders(userId: string): Promise<Reminder[]> {
    return this.reminderRepo.getUserUpcoming(userId);
  }

  async acknowledgeReminder(
    userid: string,
    reminderId: string,
  ): Promise<Reminder> {
    return this.reminderRepo.markDone(userid, reminderId);
  }
}
