import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  RepeatInterval,
  RepeatIntervalType,
  DEFAULT_REPEAT_INTERVAL,
} from '../const/repeatInterval.const';

export class CreateReminderDto {
  @ApiProperty({
    description: 'Reminder title',
    example: 'Team standup meeting',
    minLength: 2,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  title!: string;

  @ApiProperty({
    description: 'Reminder message content',
    example: 'Daily standup at 10:00 AM. Prepare your updates.',
  })
  @IsString()
  @IsNotEmpty()
  reminderMessage!: string;

  @ApiProperty({
    description: 'Date and time when the reminder should trigger (ISO 8601)',
    example: '2026-08-06T10:00:00.000Z',
  })
  @IsDateString({ strict: false })
  @IsNotEmpty()
  reminderAt!: string;

  @ApiPropertyOptional({
    description:
      'Number of times the reminder should repeat. 1 means no repeat.',
    example: 3,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  repeatCount?: number;

  @ApiPropertyOptional({
    description:
      'Minutes to wait between repeated reminders (used when repeatCount > 1)',
    example: 30,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  snoozeMinutes?: number;

  @ApiPropertyOptional({
    description: 'The interval at which the reminder repeats',
    enum: RepeatInterval,
    default: DEFAULT_REPEAT_INTERVAL,
    example: DEFAULT_REPEAT_INTERVAL,
  })
  @IsOptional()
  @IsEnum(RepeatInterval)
  repeatInterval?: RepeatIntervalType;
}
