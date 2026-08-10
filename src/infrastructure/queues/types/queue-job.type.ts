import { JobsOptions } from 'bullmq';
import { QUEUE_NAMES } from '../constants/queue.const';

export type QueueName = (typeof QUEUE_NAMES)[number];

export type QueueJob<Data = Record<string, unknown>> = {
  name: string;
  data: Data;
  opts?: JobsOptions;
};
