import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import {
  eventRoles,
  EventRole,
  DEFAULT_EVENT_ROLE,
} from '../constants/events.cons';

export class InviteMemberDto {
  @ApiProperty({
    description: 'ID of the user to invite to the event',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  userId!: string;

  @ApiPropertyOptional({
    description: 'Role of the invited member',
    enum: Object.values(eventRoles),
    default: DEFAULT_EVENT_ROLE,
    example: DEFAULT_EVENT_ROLE,
  })
  @IsOptional()
  @IsEnum(eventRoles)
  role?: EventRole;
}
