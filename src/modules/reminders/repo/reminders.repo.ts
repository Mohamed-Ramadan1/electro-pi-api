import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';

import { Reminder } from '../entity/reminder.entity';
import { CreateReminderDto } from '../dto/create-reminder.dto';

@Injectable()
export class ReminderRepository {
  constructor(
    @InjectRepository(Reminder)
    private readonly reminderRepo: Repository<Reminder>,
  ) {}
  create(userId: string, reminderData: CreateReminderDto): Promise<Reminder> {
    const reminder = this.reminderRepo.create({
      ...reminderData,
      user: { id: userId },
    });
    return this.reminderRepo.save(reminder);
  }

  findAll(userId: string): Promise<Reminder[]> {
    return this.reminderRepo.find({
      where: {
        user: { id: userId },
      },
    });
  }

  findById(userId: string, reminderId: string): Promise<Reminder> {
    return this.reminderRepo.findOneByOrFail({
      user: { id: userId },
      id: reminderId,
    });
  }
  deleteAll(userId: string): Promise<DeleteResult> {
    return this.reminderRepo.delete({
      user: { id: userId },
    });
  }
  deleteById(userId: string, reminderId: string): Promise<DeleteResult> {
    return this.reminderRepo.delete({
      user: { id: userId },
      id: reminderId,
    });
  }
}
