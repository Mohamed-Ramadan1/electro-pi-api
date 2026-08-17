import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';

// Repository import
import { ReminderRepository } from '../repo/reminders.repo';

// entity imports
import { Reminder } from '../entity/reminder.entity';

// types imports
import { queueJobsNames } from '../types/queue-jobs.type';
// dto imports.
import { CreateReminderDto } from '../dto/create-reminder.dto';
import { UpdateReminderDto } from '../dto/update-reminder.dto';
import { RescheduleReminderDto } from '../dto/reschedule-reminder.dto';
import { SnoozeReminderDto } from '../dto/snooze-reminder.dto';

// infrastructures imports
import { QueueService } from '@infrastructure/queues/service/queue.service';
import { REMINDERS_QUEUE } from '@infrastructure/queues/constants/queue.const';

@Injectable()
export class RemindersService implements OnModuleInit {
  constructor(
    private readonly reminderRepo: ReminderRepository,
    private readonly queueService: QueueService,
  ) {}

  async onModuleInit() {
    await this.queueService.add(
      REMINDERS_QUEUE,
      queueJobsNames.REGISTER_UPCOMING_REMINDERS,
      {},
      {
        repeat: {
          // pattern: '0 */6 * * *', // every 6 hours: 00:00, 06:00, 12:00, 18:00
          pattern: '* * * * *', // every minute
        },
        jobId: 'register-upcoming-reminders', // prevents duplicate repeatable jobs on restart
      },
    );
  }

  getReminders(userId: string): Promise<Reminder[]> {
    return this.reminderRepo.findAll(userId);
  }

  getReminder(userId: string, reminderId: string): Promise<Reminder> {
    return this.reminderRepo.findById(userId, reminderId);
  }

  async createReminder(
    userId: string,
    reminderData: CreateReminderDto,
  ): Promise<Reminder> {
    const reminder = await this.reminderRepo.create(userId, reminderData);
    await this.queueService.add(
      REMINDERS_QUEUE,
      queueJobsNames.SEND_REMINDER_CREATED_CONFIRMATION,
      reminder,
    );
    return reminder;
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

  getRemindersToTriggered(): Promise<Reminder[]> {
    const { startOfDay, endOfDay } = this.remindersDates();
    return this.reminderRepo.remindersToTrigger(startOfDay, endOfDay);
  }

  // Internal methods
  private remindersDates() {
    const now = new Date();

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );
    return {
      startOfDay,
      endOfDay,
    };
  }
  async updateReminderQueuedStatus(reminders: string[]): Promise<void> {
    await this.reminderRepo.updateQueuedStatus(reminders);
  }
}
