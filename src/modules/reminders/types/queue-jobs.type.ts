export const queueJobsNames = {
  REGISTER_UPCOMING_REMINDERS: 'register-upcoming-reminders',
  SEND_REMINDER_NOTIFICATION: 'send-reminder-notification',
  SEND_REMINDER_CREATED_CONFIRMATION: 'send-reminder-created-confirmation',
} as const;

export type QueueJobsNames =
  (typeof queueJobsNames)[keyof typeof queueJobsNames];
