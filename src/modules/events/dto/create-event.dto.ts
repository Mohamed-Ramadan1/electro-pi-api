import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    description: 'Event title',
    example: 'Team sync',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'Weekly team sync meeting.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Event start time (ISO 8601)',
    example: '2026-08-20T10:00:00.000Z',
  })
  @IsDateString()
  startAt!: string;

  @ApiProperty({
    description: 'Event end time (ISO 8601)',
    example: '2026-08-20T11:00:00.000Z',
  })
  @IsDateString()
  endAt!: string;

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

  @ApiPropertyOptional({
    description: 'IDs of users to add as event members',
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    ],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  members?: string[];
}
