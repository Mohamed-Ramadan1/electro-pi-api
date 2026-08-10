import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { JobsOptions, Queue } from 'bullmq';
import {
  DEFAULT_QUEUE_NAME,
  EMAIL_QUEUE_NAME,
  NOTIFICATION_QUEUE_NAME,
} from '../constants/queue.const';
import { QueueJob } from '../types/queue-job.type';

@Injectable()
export class QueueService {
  private readonly queues: Map<string, Queue>;

  constructor(
    @InjectQueue(DEFAULT_QUEUE_NAME)
    defaultQueue: Queue,
    @InjectQueue(EMAIL_QUEUE_NAME)
    emailQueue: Queue,
    @InjectQueue(NOTIFICATION_QUEUE_NAME)
    notificationQueue: Queue,
  ) {
    this.queues = new Map<string, Queue>([
      [DEFAULT_QUEUE_NAME, defaultQueue],
      [EMAIL_QUEUE_NAME, emailQueue],
      [NOTIFICATION_QUEUE_NAME, notificationQueue],
    ]);
  }

  async add<Data>(
    queueName: string,
    jobName: string,
    data: Data,
    options?: JobsOptions,
  ) {
    return this.getQueue(queueName).add(jobName, data, options);
  }

  async addDelayed<Data>(
    queueName: string,
    jobName: string,
    data: Data,
    delayMs: number,
    options?: JobsOptions,
  ) {
    return this.add(queueName, jobName, data, {
      ...options,
      delay: delayMs,
    });
  }

  async addBulk<Data>(queueName: string, jobs: Array<QueueJob<Data>>) {
    return this.getQueue(queueName).addBulk(jobs);
  }

  getQueue(queueName: string): Queue {
    const queue = this.queues.get(queueName);

    if (!queue) {
      throw new Error(`Queue "${queueName}" is not registered.`);
    }

    return queue;
  }
}
