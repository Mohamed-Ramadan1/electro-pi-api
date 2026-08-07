export const DEFAULT_QUEUE_NAME = 'default';

export const EMAIL_QUEUE_NAME = 'email';

export const NOTIFICATION_QUEUE_NAME = 'notification';

export const QUEUE_NAMES = [
  DEFAULT_QUEUE_NAME,
  EMAIL_QUEUE_NAME,
  NOTIFICATION_QUEUE_NAME,
] as const;

export const DEFAULT_QUEUE_PREFIX = 'electro-pi';

export const DEFAULT_QUEUE_REDIS_DB = 1;

export const DEFAULT_QUEUE_ATTEMPTS = 3;

export const DEFAULT_QUEUE_BACKOFF_DELAY_MS = 5_000;

export const DEFAULT_QUEUE_REMOVE_ON_COMPLETE = 1_000;

export const DEFAULT_QUEUE_REMOVE_ON_FAIL = 5_000;
