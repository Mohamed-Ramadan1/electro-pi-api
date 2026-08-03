export const NotificationsType = {
  TASK_ASSIGNED: 'task_assigned',
  TASK_STATUS_CHANGED: 'task_status_changed',
  PROJECT_INVITED: 'project_invited',
  PROJECT_STATUS_CHANGED: 'project_status_changed',
  GENERAL: 'general',
} as const;

export type NotificationType =
  (typeof NotificationsType)[keyof typeof NotificationsType];

export const DEFAULT_NOTIFICATION_TYPE = NotificationsType.GENERAL;
