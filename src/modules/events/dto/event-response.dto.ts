import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EventMemberResponseDto,
  UserRefDto,
} from './event-member-response.dto';

export class EventResponseDto {
  @ApiProperty({
    description: 'Event UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'Event title',
    example: 'Team sync',
    maxLength: 150,
  })
  title!: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'Weekly team sync meeting.',
  })
  description!: string | null;

  @ApiProperty({
    description: 'Event start time (ISO 8601)',
    example: '2026-08-20T10:00:00.000Z',
  })
  startAt!: string;

  @ApiProperty({
    description: 'Event end time (ISO 8601)',
    example: '2026-08-20T11:00:00.000Z',
  })
  endAt!: string;

  @ApiPropertyOptional({
    description: 'Event location',
    example: 'Room 4B',
    maxLength: 255,
  })
  location!: string | null;

  @ApiPropertyOptional({
    description: 'Event meeting link',
    example: 'https://meet.example.com/team-sync',
    maxLength: 500,
  })
  meetingLink!: string | null;

  @ApiPropertyOptional({
    description: 'Event theme',
    example: 'planning',
    maxLength: 100,
  })
  theme!: string | null;

  @ApiPropertyOptional({
    description: 'User who created the event',
    type: () => UserRefDto,
  })
  creator?: UserRefDto;

  @ApiPropertyOptional({
    description: 'Event members / invitations',
    type: () => [EventMemberResponseDto],
  })
  members?: EventMemberResponseDto[];

  @ApiProperty({
    description: 'Whether the event is active',
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
