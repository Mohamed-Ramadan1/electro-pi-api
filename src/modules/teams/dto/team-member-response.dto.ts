import { ApiProperty } from '@nestjs/swagger';
import { teamRoles, DEFAULT_TEAM_ROLE } from '../constants/teams.cons';

export class UserRefDto {
  @ApiProperty({
    description: 'User UUID',
    example: 'fbfeb910-21a9-4b2d-ba51-b4ead21dc4bb',
    format: 'uuid',
  })
  id!: string;
}

export class TeamRefDto {
  @ApiProperty({
    description: 'Team UUID',
    example: '2381b8a9-ad25-4e04-a2c0-6e1faf574428',
    format: 'uuid',
  })
  id!: string;
}

export class TeamMemberResponseDto {
  @ApiProperty({
    description: 'Team member UUID',
    example: '260c4cfe-83ca-42db-ba9c-70e9e836d995',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'Team this membership belongs to',
    type: () => TeamRefDto,
  })
  team!: TeamRefDto;

  @ApiProperty({
    description: 'User who is a member of the team',
    type: () => UserRefDto,
  })
  user!: UserRefDto;

  @ApiProperty({
    description: 'Role of the member within the team',
    enum: Object.values(teamRoles),
    default: DEFAULT_TEAM_ROLE,
    example: DEFAULT_TEAM_ROLE,
  })
  role!: string;

  @ApiProperty({
    description: 'User who added this member to the team',
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
