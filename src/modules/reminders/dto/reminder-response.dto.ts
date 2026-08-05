import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  RepeatInterval,
  RepeatIntervalType,
  DEFAULT_REPEAT_INTERVAL,
} from '../const/repeatInterval.const';

export class ReminderResponseDto {
  @ApiProperty({
    description: 'Reminder UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'Reminder title',
    example: 'Team standup meeting',
    minLength: 2,
    maxLength: 150,
  })
  title!: string;

  @ApiProperty({
    description: 'Reminder message content',
    example: 'Daily standup at 10:00 AM. Prepare your updates.',
  })
  reminderMessage!: string;

  @ApiProperty({
    description: 'Date and time when the reminder should trigger (ISO 8601)',
    example: '2026-08-06T10:00:00.000Z',
  })
  reminderAt!: string;

  @ApiPropertyOptional({
    description:
      'Number of times the reminder should repeat. 1 means no repeat.',
    example: 3,
    minimum: 1,
    default: 1,
  })
  repeatCount!: number | null;

  @ApiPropertyOptional({
    description:
      'Minutes to wait between repeated reminders (used when repeatCount > 1)',
    example: 30,
    minimum: 1,
  })
  snoozeMinutes!: number | null;

  @ApiProperty({
    description: 'The interval at which the reminder repeats',
    enum: RepeatInterval,
    default: DEFAULT_REPEAT_INTERVAL,
    example: DEFAULT_REPEAT_INTERVAL,
  })
  repeatInterval!: RepeatIntervalType;

  @ApiProperty({
    description: 'Whether the reminder has been sent',
    example: false,
  })
  isSent!: boolean;

  @ApiProperty({
    description: 'Whether the reminder has been completed or dismissed',
    example: false,
  })
  isCompleted!: boolean;

  @ApiPropertyOptional({
    description:
      'Next trigger date and time for recurring reminders (ISO 8601)',
    example: '2026-08-07T10:00:00.000Z',
  })
  nextTriggerAt!: string | null;

  @ApiProperty({
    description: 'Whether the reminder is active',
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
