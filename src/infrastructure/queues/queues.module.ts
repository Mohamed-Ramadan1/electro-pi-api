import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BullModule } from '@nestjs/bullmq';
import { createQueueOptions } from './config/queue.config';
import { QueueService } from './service/queue.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createQueueOptions,
    }),
  ],
  providers: [QueueService],
  exports: [BullModule, QueueService],
})
export class QueuesModule {}
