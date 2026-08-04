export const RepeatInterval = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
} as const;

export type RepeatIntervalType =
  (typeof RepeatInterval)[keyof typeof RepeatInterval];

export const DEFAULT_REPEAT_INTERVAL = RepeatInterval.NONE;
