import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BullModule } from '@nestjs/bullmq';
import { createQueueOptions } from './config/queue.config';
import { QueueService } from './service/queue.service';

import {
  DEFAULT_QUEUE_NAME,
  EMAIL_QUEUE_NAME,
  REMINDERS_QUEUE,
  NOTIFICATION_QUEUE_NAME,
} from './constants/queue.const';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createQueueOptions,
    }),
    BullModule.registerQueue(
      { name: DEFAULT_QUEUE_NAME },
      { name: EMAIL_QUEUE_NAME },
      { name: REMINDERS_QUEUE },
      { name: NOTIFICATION_QUEUE_NAME },
    ),
  ],

  providers: [QueueService],
  exports: [BullModule, QueueService],
})
export class QueuesModule {}
