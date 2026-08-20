export const eventRoles = {
  COORDINATOR: 'coordinator',
  ADMIN: 'admin',
  SPEAKER: 'speaker',
  ATTENDEE: 'attendee',
} as const;

export type EventRole = (typeof eventRoles)[keyof typeof eventRoles];

export const DEFAULT_EVENT_ROLE = eventRoles.ATTENDEE;

export const invitationStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  CANCELLED: 'cancelled',
} as const;

export type InvitationStatus =
  (typeof invitationStatus)[keyof typeof invitationStatus];

export const DEFAULT_INVITATION_STATUS = invitationStatus.PENDING;
