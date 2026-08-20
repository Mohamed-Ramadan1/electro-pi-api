import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateEventDto {
  @ApiPropertyOptional({
    description: 'Event title',
    example: 'Team sync',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'Weekly team sync meeting.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Event start time (ISO 8601)',
    example: '2026-08-20T10:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startAt?: string;

  @ApiPropertyOptional({
    description: 'Event end time (ISO 8601)',
    example: '2026-08-20T11:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  endAt?: string;

  @ApiPropertyOptional({
    description: 'Event location',
    example: 'Room 4B',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiPropertyOptional({
    description: 'Event meeting link',
    example: 'https://meet.example.com/team-sync',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  meetingLink?: string;

  @ApiPropertyOptional({
    description: 'Event theme',
    example: 'planning',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  theme?: string;
}
