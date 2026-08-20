import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, Repository } from 'typeorm';

// Entity imports
import { EventMember } from '../entity/event-members.entity';

// Constants imports
import {
  invitationStatus,
  InvitationStatus,
  EventRole,
} from '../constants/events.cons';

@Injectable()
export class EventMemberRepo {
  constructor(
    @InjectRepository(EventMember)
    private readonly eventMemberRepo: Repository<EventMember>,
  ) {}

  getEventMembers(eventId: string): Promise<EventMember[]> {
    return this.eventMemberRepo.find({
      where: {
        event: { id: eventId },
        status: invitationStatus.ACCEPTED,
      },
      relations: { user: true, creator: true },
    });
  }

  getInvitations(eventId: string): Promise<EventMember[]> {
    return this.eventMemberRepo.find({
      where: {
        event: { id: eventId },
        status: invitationStatus.PENDING,
      },
      relations: { user: true, creator: true },
    });
  }

  getMyInvitations(userId: string): Promise<EventMember[]> {
    return this.eventMemberRepo.find({
      where: {
        user: { id: userId },
        status: invitationStatus.PENDING,
      },
      relations: { event: true, creator: true },
    });
  }

  getMemberByEventAndUser(
    eventId: string,
    userId: string,
  ): Promise<EventMember | null> {
    return this.eventMemberRepo.findOneBy({
      event: { id: eventId },
      user: { id: userId },
    });
  }

  invite(payload: DeepPartial<EventMember>): Promise<EventMember> {
    const invitation = this.eventMemberRepo.create(payload);
    return this.eventMemberRepo.save(invitation);
  }

  async removeMember(eventId: string, memberId: string): Promise<void> {
    const member = await this.getMemberById(eventId, memberId);
    await this.eventMemberRepo.delete({ id: member.id });
  }

  async updateMemberRole(
    eventId: string,
    memberId: string,
    role: EventRole,
  ): Promise<EventMember> {
    const member = await this.getMemberById(eventId, memberId);
    member.role = role;
    return this.eventMemberRepo.save(member);
  }

  cancelInvitation(
    eventId: string,
    invitationId: string,
  ): Promise<EventMember> {
    return this.setInvitationStatus(
      eventId,
      invitationId,
      invitationStatus.CANCELLED,
    );
  }

  acceptInvitation(
    eventId: string,
    invitationId: string,
  ): Promise<EventMember> {
    return this.setInvitationStatus(
      eventId,
      invitationId,
      invitationStatus.ACCEPTED,
    );
  }

  declineInvitation(
    eventId: string,
    invitationId: string,
  ): Promise<EventMember> {
    return this.setInvitationStatus(
      eventId,
      invitationId,
      invitationStatus.DECLINED,
    );
  }

  async leaveEvent(eventId: string, userId: string): Promise<void> {
    const member = await this.eventMemberRepo.findOneBy({
      event: { id: eventId },
      user: { id: userId },
    });
    if (!member)
      throw new BadRequestException('You are not a member of this event.');
    await this.eventMemberRepo.delete({ id: member.id });
  }

  // Helper methods
  private async getMemberById(
    eventId: string,
    memberId: string,
  ): Promise<EventMember> {
    const member = await this.eventMemberRepo.findOneBy({
      event: { id: eventId },
      id: memberId,
    });
    if (!member) throw new NotFoundException('Member not found.');
    return member;
  }

  private async getInvitationById(
    eventId: string,
    invitationId: string,
  ): Promise<EventMember> {
    const invitation = await this.eventMemberRepo.findOneBy({
      event: { id: eventId },
      id: invitationId,
      status: invitationStatus.PENDING,
    });
    if (!invitation) throw new NotFoundException('Invitation not found.');
    return invitation;
  }

  private async setInvitationStatus(
    eventId: string,
    invitationId: string,
    status: InvitationStatus,
  ): Promise<EventMember> {
    const invitation = await this.getInvitationById(eventId, invitationId);
    invitation.status = status;
    return this.eventMemberRepo.save(invitation);
  }
}
