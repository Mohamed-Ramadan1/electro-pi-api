import { BadRequestException, Injectable } from '@nestjs/common';

import { DeepPartial } from 'typeorm';

// Entity imports
import { Event } from '../entity/event.entity';
import { EventMember } from '../entity/event-members.entity';

// Repo imports
import { EventsRepo } from '../repo/event.repo';
import { EventMemberRepo } from '../repo/event-member.repo';

// Dto imports
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { InviteMemberDto } from '../dto/invite-member.dto';
import { UpdateMemberRoleDto } from '../dto/update-member-role.dto';
import { RescheduleEventDto } from '../dto/reschedule-event.dto';
import { CheckConflictDto } from '../dto/check-conflict.dto';

// Constants imports
import { DEFAULT_EVENT_ROLE, invitationStatus } from '../constants/events.cons';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventRepo: EventsRepo,
    private readonly eventMemberRepo: EventMemberRepo,
  ) {}

  createEvent(eventData: CreateEventDto, creatorId: string): Promise<Event> {
    const payload: DeepPartial<Event> = {
      title: eventData.title,
      description: eventData.description ?? null,
      startAt: new Date(eventData.startAt),
      endAt: new Date(eventData.endAt),
      location: eventData.location ?? null,
      meetingLink: eventData.meetingLink ?? null,
      theme: eventData.theme ?? null,
      creator: { id: creatorId },
      members: eventData.members?.map((userId) => ({
        user: { id: userId },
        role: DEFAULT_EVENT_ROLE,
        status: invitationStatus.ACCEPTED,
        creator: { id: creatorId },
      })),
    };
    return this.eventRepo.create(payload);
  }

  async cloneEvent(id: string, creatorId: string): Promise<Event> {
    const event = await this.eventRepo.getById(id);
    const payload: DeepPartial<Event> = {
      title: `${event.title} (copy)`,
      description: event.description,
      startAt: event.startAt,
      endAt: event.endAt,
      location: event.location,
      meetingLink: event.meetingLink,
      theme: event.theme,
      creator: { id: creatorId },
    };
    return this.eventRepo.create(payload);
  }

  getEvents(): Promise<Event[]> {
    return this.eventRepo.getEvents();
  }

  getEvent(id: string): Promise<Event> {
    return this.eventRepo.getEvent(id);
  }

  updateEvent(id: string, eventData: UpdateEventDto): Promise<Event> {
    return this.eventRepo.update(id, this.buildEventPayload(eventData));
  }

  deleteEvent(id: string): Promise<void> {
    return this.eventRepo.deleteEvent(id);
  }

  async activateEvent(id: string): Promise<void> {
    await this.eventRepo.activate(id);
  }

  async deactivateEvent(id: string): Promise<void> {
    await this.eventRepo.deactivate(id);
  }

  getEventMembers(id: string): Promise<EventMember[]> {
    return this.eventMemberRepo.getEventMembers(id);
  }

  removeMember(id: string, memberId: string): Promise<void> {
    return this.eventMemberRepo.removeMember(id, memberId);
  }

  updateMemberRole(
    id: string,
    memberId: string,
    roleData: UpdateMemberRoleDto,
  ): Promise<EventMember> {
    return this.eventMemberRepo.updateMemberRole(id, memberId, roleData.role);
  }

  rescheduleEvent(
    id: string,
    rescheduleData: RescheduleEventDto,
  ): Promise<Event> {
    return this.eventRepo.reschedule(
      id,
      new Date(rescheduleData.startAt),
      new Date(rescheduleData.endAt),
    );
  }

  async checkConflicts(id: string): Promise<Event[]> {
    const event = await this.eventRepo.getById(id);
    return this.eventRepo.checkConflicts(id, event.startAt, event.endAt);
  }

  getEventHistory(id: string): Promise<Event> {
    return this.eventRepo.getEvent(id);
  }

  async inviteMember(
    id: string,
    inviteData: InviteMemberDto,
    creatorId: string,
  ): Promise<EventMember> {
    const existing = await this.eventMemberRepo.getMemberByEventAndUser(
      id,
      inviteData.userId,
    );
    if (existing)
      throw new BadRequestException(
        'User is already invited or a member of this event.',
      );

    const payload: DeepPartial<EventMember> = {
      event: { id },
      user: { id: inviteData.userId },
      role: inviteData.role ?? DEFAULT_EVENT_ROLE,
      status: invitationStatus.PENDING,
      creator: { id: creatorId },
    };
    return this.eventMemberRepo.invite(payload);
  }

  cancelMemberInvitation(
    id: string,
    invitationId: string,
  ): Promise<EventMember> {
    return this.eventMemberRepo.cancelInvitation(id, invitationId);
  }

  acceptInvitation(id: string, invitationId: string): Promise<EventMember> {
    return this.eventMemberRepo.acceptInvitation(id, invitationId);
  }

  declineInvitation(id: string, invitationId: string): Promise<EventMember> {
    return this.eventMemberRepo.declineInvitation(id, invitationId);
  }

  getInvitations(id: string): Promise<EventMember[]> {
    return this.eventMemberRepo.getInvitations(id);
  }

  getMyInvitations(userId: string): Promise<EventMember[]> {
    return this.eventMemberRepo.getMyInvitations(userId);
  }

  getMyEvents(userId: string): Promise<Event[]> {
    return this.eventRepo.getMyEvents(userId);
  }

  getUpcomingEvents(): Promise<Event[]> {
    return this.eventRepo.getUpcomingEvents();
  }

  checkConflict(userId: string, data: CheckConflictDto): Promise<Event[]> {
    return this.eventRepo.checkUserConflicts(
      userId,
      new Date(data.startAt),
      new Date(data.endAt),
    );
  }

  leaveEvent(id: string, userId: string): Promise<void> {
    return this.eventMemberRepo.leaveEvent(id, userId);
  }

  // Helper methods
  private buildEventPayload(eventData: UpdateEventDto): DeepPartial<Event> {
    const payload: DeepPartial<Event> = {};
    if (eventData.title !== undefined) payload.title = eventData.title;
    if (eventData.description !== undefined)
      payload.description = eventData.description;
    if (eventData.startAt !== undefined)
      payload.startAt = new Date(eventData.startAt);
    if (eventData.endAt !== undefined)
      payload.endAt = new Date(eventData.endAt);
    if (eventData.location !== undefined) payload.location = eventData.location;
    if (eventData.meetingLink !== undefined)
      payload.meetingLink = eventData.meetingLink;
    if (eventData.theme !== undefined) payload.theme = eventData.theme;
    return payload;
  }
}
