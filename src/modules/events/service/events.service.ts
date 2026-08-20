import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  createEvent(): any {}
  cloneEvent(id: string): any {}
  getEvents(): any {}
  getEvent(id: string): any {}
  deleteEvent(id: string): any {}
  updateEvent(id: string): any {}
  activateEvent(id: string): any {}
  deactivateEvent(id: string): any {}
  getEventMembers(id: string): any {}
  removeMember(id: string, memberId: string): any {}
  updateMemberRole(id: string, memberId: string): any {}

  rescheduleEvent(id: string): any {}
  checkConflicts(id: string): any {}
  getEventHistory(id: string): any {}

  inviteMember(id: string): any {}
  cancelMemberInvitation(id: string, invitationId: string): any {}
  acceptInvitation(id: string, invitationId: string): any {}
  declineInvitation(id: string, invitationId: string): any {}
  getInvitations(id: string): any {}
  getMyInvitations(): any {}

  getMyEvents(): any {}
  getUpcomingEvents(): any {}
  checkConflict(): any {}
  leaveEvent(id: string): any {}
}
