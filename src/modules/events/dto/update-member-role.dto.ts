import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { eventRoles, EventRole } from '../constants/events.cons';

export class UpdateMemberRoleDto {
  @ApiProperty({
    description: 'New role for the event member',
    enum: Object.values(eventRoles),
    example: Object.values(eventRoles)[1],
  })
  @IsEnum(eventRoles)
  role!: EventRole;
}
