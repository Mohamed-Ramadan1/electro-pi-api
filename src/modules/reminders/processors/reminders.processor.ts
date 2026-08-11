import { Processor, WorkerHost } from '@nestjs/bullmq';

import { REMINDERS_QUEUE } from '@infrastructure/queues/constants/queue.const';

import { Job } from 'bullmq';

//types imports
import { queueJobsNames } from '../types/queue-jobs.type';

import { NotificationsService } from '@modules/notifications/service/notifications.service';
import { CreateNotificationDto } from '@modules/notifications/dto/create-notification.dto';

interface ReminderJobData {
  id: string;
  title: string;
  reminderMessage: string;
  reminderAt: string;
  user: { id: string };
}

@Processor(REMINDERS_QUEUE)
export class ReminderProcessor extends WorkerHost {
  constructor(private readonly notificationService: NotificationsService) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async process(job: Job, token?: string): Promise<any> {
    switch (job.name) {
      case queueJobsNames.SEND_REMINDER_CREATED_CONFIRMATION:
        return this.handleReminderCreatedConfirmation(job);

      case queueJobsNames.SEND_REMINDER_NOTIFICATION:
        return this.handleReminderNotification();

      case queueJobsNames.REGISTER_UPCOMING_REMINDERS:
        return this.handleRegisterUpcomingReminders();

      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  private async handleReminderCreatedConfirmation(job: Job): Promise<void> {
    const reminder = job.data as ReminderJobData;

    const reminderDate = new Date(reminder.reminderAt).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const notificationData: CreateNotificationDto = {
      userId: reminder.user.id,
      title: 'New reminder created successfully',
      message: `Your reminder "${reminder.title}" has been created and will remind you on ${reminderDate}.`,
      referenceId: reminder.id,
      referenceType: 'reminder',
    };

    await this.notificationService.createNotification(notificationData);
  }

  private handleReminderNotification(): void {
    throw new Error('send-reminder-notification job is not yet implemented');
  }

  private handleRegisterUpcomingReminders(): void {
    // logic to scan/register upcoming reminders into the queue
  }
}
