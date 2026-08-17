import { Processor, WorkerHost } from '@nestjs/bullmq';

import { REMINDERS_QUEUE } from '@infrastructure/queues/constants/queue.const';

import { Job } from 'bullmq';

//types imports
import { queueJobsNames } from '../types/queue-jobs.type';

import { NotificationsService } from '@modules/notifications/service/notifications.service';
import { CreateNotificationDto } from '@modules/notifications/dto/create-notification.dto';
import { QueueService } from '@infrastructure/queues/service/queue.service';
import { RemindersService } from '../service/reminders.service';

import { ReminderJobData } from '../interfaces/reminder-job-data.interface';

type ReminderNotificationType =
  'reminder-creation-notification' | 'reminder-notification';

@Processor(REMINDERS_QUEUE, { concurrency: 9 })
export class ReminderProcessor extends WorkerHost {
  constructor(
    private readonly notificationService: NotificationsService,
    private readonly queueService: QueueService,
    private readonly reminderService: RemindersService,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case queueJobsNames.SEND_REMINDER_CREATED_CONFIRMATION:
        return this.handleReminderCreatedConfirmation(job);

      case queueJobsNames.SEND_REMINDER_NOTIFICATION:
        return this.handleReminderNotification(job);

      case queueJobsNames.REGISTER_UPCOMING_REMINDERS:
        return this.handleRegisterUpcomingReminders();

      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  private async handleReminderCreatedConfirmation(job: Job): Promise<void> {
    await this.createReminderNotification(job.data, {
      title: 'New reminder created successfully',
      notificationType: 'reminder-creation-notification',
    });
  }

  private async handleReminderNotification(job: Job): Promise<void> {
    const reminder = job.data as ReminderJobData;

    await this.createReminderNotification(reminder, {
      title: `Reminder: ${reminder.title}`,
      notificationType: 'reminder-notification',
    });
  }

  private async handleRegisterUpcomingReminders(): Promise<void> {
    const reminders = await this.reminderService.getRemindersToTriggered();
    const remindersIds: string[] = [];

    for (const element of reminders) {
      try {
        const delay = element.reminderAt.getTime() - Date.now();
        if (delay <= 0) continue;

        await this.queueService.addDelayed(
          REMINDERS_QUEUE,
          queueJobsNames.SEND_REMINDER_NOTIFICATION,
          element,
          delay,
        );
        remindersIds.push(element.id);
      } catch {}
    }

    if (remindersIds.length > 0) {
      await this.reminderService.updateReminderQueuedStatus(remindersIds);
    }
  }

  private async createReminderNotification(
    reminder: ReminderJobData,
    metaData: { title: string; notificationType: ReminderNotificationType },
  ): Promise<void> {
    const reminderDate = new Date(reminder.reminderAt).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const messages: Record<ReminderNotificationType, string> = {
      'reminder-creation-notification': `Your reminder "${reminder.title}" has been created and will remind you on ${reminderDate}.`,
      'reminder-notification': `${reminder.reminderMessage}`,
    };

    const notificationData: CreateNotificationDto = {
      userId: reminder.user.id,
      title: metaData.title,
      message: messages[metaData.notificationType],
      referenceId: reminder.id,
      referenceType: 'reminder',
    };

    await this.notificationService.createNotification(notificationData);
  }
}
