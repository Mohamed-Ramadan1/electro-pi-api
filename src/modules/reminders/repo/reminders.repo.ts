import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeleteResult,
  Repository,
  UpdateResult,
  MoreThanOrEqual,
} from 'typeorm';

import { Reminder } from '../entity/reminder.entity';
import { CreateReminderDto } from '../dto/create-reminder.dto';
import { UpdateReminderDto } from '../dto/update-reminder.dto';
import { RescheduleReminderDto } from '../dto/reschedule-reminder.dto';

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

  async update(
    userId: string,
    reminderId: string,
    updateData: UpdateReminderDto,
  ): Promise<Reminder> {
    const reminder = await this.reminderRepo.findOneByOrFail({
      user: { id: userId },
      id: reminderId,
    });
    this.reminderRepo.merge(reminder, updateData);
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

  reschedule(
    userId: string,
    reminderId: string,
    data: RescheduleReminderDto,
  ): Promise<UpdateResult> {
    return this.reminderRepo.update(
      {
        user: { id: userId },
        id: reminderId,
      },
      {
        reminderAt: data.newDate,
      },
    );
  }

  async toggleReminderStatus(
    userId: string,
    reminderId: string,
  ): Promise<Reminder> {
    const reminder = await this.reminderRepo.findOneByOrFail({
      user: { id: userId },
      id: reminderId,
    });

    reminder.isActive = !reminder.isActive;

    return this.reminderRepo.save(reminder);
  }

  async snooze(
    userId: string,
    reminderId: string,
    snoozeMinutes: number,
  ): Promise<Reminder> {
    const reminder = await this.reminderRepo.findOneByOrFail({
      id: reminderId,
      user: { id: userId },
    });

    reminder.snoozeMinutes = snoozeMinutes;
    reminder.nextTriggerAt = new Date(Date.now() + snoozeMinutes * 60 * 1000);
    reminder.isSent = false;

    return this.reminderRepo.save(reminder);
  }

  async markDone(userId: string, reminDerId: string): Promise<Reminder> {
    const reminder = await this.reminderRepo.findOneByOrFail({
      id: reminDerId,
      user: { id: userId },
    });

    reminder.isCompleted = true;
    reminder.isSent = true;
    return this.reminderRepo.save(reminder);
  }

  getUserUpcoming(userId: string): Promise<Reminder[]> {
    const now = new Date();
    return this.reminderRepo.find({
      where: {
        user: { id: userId },
        reminderAt: MoreThanOrEqual(now),
      },
      order: {
        reminderAt: 'ASC',
      },
    });
  }
}
