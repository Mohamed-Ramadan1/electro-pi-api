export const tasksStatus = {
  TODO: 'todo',
  INPROGRESS: 'inprogress',
  DONE: 'done',
} as const;

export type TasksStatus = (typeof tasksStatus)[keyof typeof tasksStatus];

export const DEFAULT_TASKS_STATUS = tasksStatus.TODO;

export const tasksPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type TasksPriority = (typeof tasksPriority)[keyof typeof tasksPriority];

export const DEFAULT_TASKS_PRIORITY = tasksPriority.MEDIUM;
