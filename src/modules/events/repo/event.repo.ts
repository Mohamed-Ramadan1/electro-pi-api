import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import { DeepPartial, LessThan, MoreThan, Not, Repository } from 'typeorm';

// Entity imports
import { Event } from '../entity/event.entity';

// Constants imports
import { invitationStatus } from '../constants/events.cons';

@Injectable()
export class EventsRepo {
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
  ) {}

  create(payload: DeepPartial<Event>): Promise<Event> {
    const event = this.eventRepo.create(payload);
    return this.eventRepo.save(event);
  }

  getEvents(): Promise<Event[]> {
    return this.eventRepo.find({ relations: { creator: true } });
  }

  getEvent(id: string): Promise<Event> {
    return this.eventRepo.findOneOrFail({
      where: { id },
      relations: { creator: true, members: { user: true } },
    });
  }

  async update(id: string, payload: DeepPartial<Event>): Promise<Event> {
    const event = await this.getById(id);
    Object.assign(event, payload);
    return this.eventRepo.save(event);
  }

  async deleteEvent(id: string): Promise<void> {
    await this.getById(id);
    await this.eventRepo.delete(id);
  }

  async activate(id: string): Promise<void> {
    const event = await this.getById(id);
    if (event.isActive) throw new BadRequestException('Event already active');
    event.isActive = true;
    await this.eventRepo.save(event);
  }

  async deactivate(id: string): Promise<void> {
    const event = await this.getById(id);
    if (!event.isActive)
      throw new BadRequestException('Event already not active');
    event.isActive = false;
    await this.eventRepo.save(event);
  }

  getMyEvents(userId: string): Promise<Event[]> {
    return this.eventRepo.find({
      where: [
        { creator: { id: userId } },
        {
          members: {
            user: { id: userId },
            status: invitationStatus.ACCEPTED,
          },
        },
      ],
      relations: { creator: true, members: { user: true } },
    });
  }

  getUpcomingEvents(): Promise<Event[]> {
    return this.eventRepo.find({
      where: { startAt: MoreThan(new Date()) },
      order: { startAt: 'ASC' },
      relations: { creator: true },
    });
  }

  async reschedule(id: string, startAt: Date, endAt: Date): Promise<Event> {
    const event = await this.getById(id);
    event.startAt = startAt;
    event.endAt = endAt;
    return this.eventRepo.save(event);
  }

  checkConflicts(
    eventId: string,
    startAt: Date,
    endAt: Date,
  ): Promise<Event[]> {
    return this.eventRepo.find({
      where: {
        id: Not(eventId),
        startAt: LessThan(endAt),
        endAt: MoreThan(startAt),
      },
      relations: { creator: true },
    });
  }

  checkUserConflicts(
    userId: string,
    startAt: Date,
    endAt: Date,
  ): Promise<Event[]> {
    return this.eventRepo.find({
      where: [
        {
          creator: { id: userId },
          startAt: LessThan(endAt),
          endAt: MoreThan(startAt),
        },
        {
          members: {
            user: { id: userId },
            status: invitationStatus.ACCEPTED,
          },
          startAt: LessThan(endAt),
          endAt: MoreThan(startAt),
        },
      ],
      relations: { creator: true },
    });
  }

  // Helper methods
  async getById(id: string): Promise<Event> {
    const event = await this.eventRepo.findOneBy({ id });
    if (!event) throw new BadRequestException('Event not found.');
    return event;
  }
}
