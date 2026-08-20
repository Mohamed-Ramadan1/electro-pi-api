import { ApiProperty } from '@nestjs/swagger';
import {
  eventRoles,
  DEFAULT_EVENT_ROLE,
  invitationStatus,
  DEFAULT_INVITATION_STATUS,
} from '../constants/events.cons';

export class UserRefDto {
  @ApiProperty({
    description: 'User UUID',
    example: 'fbfeb910-21a9-4b2d-ba51-b4ead21dc4bb',
    format: 'uuid',
  })
  id!: string;
}

export class EventRefDto {
  @ApiProperty({
    description: 'Event UUID',
    example: '2381b8a9-ad25-4e04-a2c0-6e1faf574428',
    format: 'uuid',
  })
  id!: string;
}

export class EventMemberResponseDto {
  @ApiProperty({
    description: 'Event membership UUID',
    example: '260c4cfe-83ca-42db-ba9c-70e9e836d995',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'Event this membership belongs to',
    type: () => EventRefDto,
  })
  event!: EventRefDto;

  @ApiProperty({
    description: 'User who is a member of the event',
    type: () => UserRefDto,
  })
  user!: UserRefDto;

  @ApiProperty({
    description: 'Role of the member within the event',
    enum: Object.values(eventRoles),
    default: DEFAULT_EVENT_ROLE,
    example: DEFAULT_EVENT_ROLE,
  })
  role!: string;

  @ApiProperty({
    description: 'Invitation / membership status',
    enum: Object.values(invitationStatus),
    default: DEFAULT_INVITATION_STATUS,
    example: DEFAULT_INVITATION_STATUS,
  })
  status!: string;

  @ApiProperty({
    description: 'User who invited / added this member',
    type: () => UserRefDto,
  })
  creator!: UserRefDto;

  @ApiProperty({
    description: 'Whether the membership is active',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Creation timestamp (ISO 8601)',
    example: '2026-08-01T10:30:00.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Last-update timestamp (ISO 8601)',
    example: '2026-08-01T11:00:00.000Z',
  })
  updatedAt!: string;
}
