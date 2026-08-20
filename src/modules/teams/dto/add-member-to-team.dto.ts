import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import {
  teamRoles,
  TeamRole,
  DEFAULT_TEAM_ROLE,
} from '../constants/teams.cons';

export class AddMemberToTeamDto {
  @ApiProperty({
    description: 'ID of the user to add as a team member',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  userId!: string;

  @ApiPropertyOptional({
    description: 'Role of the member in the team',
    enum: Object.values(teamRoles),
    default: DEFAULT_TEAM_ROLE,
    example: DEFAULT_TEAM_ROLE,
  })
  @IsOptional()
  @IsEnum(teamRoles)
  role?: TeamRole;
}
