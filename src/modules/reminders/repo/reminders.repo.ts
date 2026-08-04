import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Reminder } from '../entity/reminder.entity';

export class ReminderRepository {
  constructor(
    @InjectRepository(Reminder)
    private readonly reminderEntity: Repository<Reminder>,
  ) {}
}
