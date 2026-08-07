import { ConfigService } from '@nestjs/config';
import { BullRootModuleOptions } from '@nestjs/bullmq';
import { toNumber } from '@core/index';
// import { toNumber } from '../../../core/config/env.utils';
import {
  DEFAULT_QUEUE_ATTEMPTS,
  DEFAULT_QUEUE_BACKOFF_DELAY_MS,
  DEFAULT_QUEUE_PREFIX,
  DEFAULT_QUEUE_REDIS_DB,
  DEFAULT_QUEUE_REMOVE_ON_COMPLETE,
  DEFAULT_QUEUE_REMOVE_ON_FAIL,
} from '../constants/queue.const';

export function createQueueOptions(
  config: ConfigService,
): BullRootModuleOptions {
  return {
    connection: {
      db: toNumber(
        config.get<string>('QUEUE_REDIS_DB'),
        DEFAULT_QUEUE_REDIS_DB,
      ),
      host: config.get<string>('QUEUE_REDIS_HOST', 'localhost'),
      maxRetriesPerRequest: null,
      password: config.get<string>('QUEUE_REDIS_PASSWORD') || undefined,
      port: toNumber(config.get<string>('QUEUE_REDIS_PORT'), 6379),
    },
    defaultJobOptions: {
      attempts: toNumber(
        config.get<string>('QUEUE_DEFAULT_ATTEMPTS'),
        DEFAULT_QUEUE_ATTEMPTS,
      ),
      backoff: {
        delay: toNumber(
          config.get<string>('QUEUE_BACKOFF_DELAY_MS'),
          DEFAULT_QUEUE_BACKOFF_DELAY_MS,
        ),
        type: 'exponential',
      },
      removeOnComplete: toNumber(
        config.get<string>('QUEUE_REMOVE_ON_COMPLETE'),
        DEFAULT_QUEUE_REMOVE_ON_COMPLETE,
      ),
      removeOnFail: toNumber(
        config.get<string>('QUEUE_REMOVE_ON_FAIL'),
        DEFAULT_QUEUE_REMOVE_ON_FAIL,
      ),
    },
    prefix: config.get<string>('QUEUE_PREFIX', DEFAULT_QUEUE_PREFIX),
  };
}
