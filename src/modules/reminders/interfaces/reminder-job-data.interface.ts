export interface ReminderJobData {
  id: string;
  title: string;
  reminderMessage: string;
  reminderAt: string;
  user: { id: string };
}
