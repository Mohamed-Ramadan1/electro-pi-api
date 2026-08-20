import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TeamMemberResponseDto,
  UserRefDto,
  TeamRefDto,
} from './team-member-response.dto';

export class TeamResponseDto {
  @ApiProperty({
    description: 'Team UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'Team name',
    example: 'Platform Engineering',
  })
  name!: string;

  @ApiProperty({
    description: 'Unique team key',
    example: 'platform-eng',
  })
  key!: string;

  @ApiProperty({
    description: 'Team description',
    example: 'Owns the core platform services and infrastructure.',
  })
  description!: string;

  @ApiPropertyOptional({
    description: 'Team avatar URL',
    example: 'https://cdn.example.com/avatars/platform-eng.png',
  })
  avatar?: string | null;

  @ApiPropertyOptional({
    description: 'User who created the team',
    type: () => UserRefDto,
  })
  creator?: UserRefDto;

  @ApiPropertyOptional({
    description: 'Team members',
    type: () => [TeamMemberResponseDto],
  })
  members?: TeamMemberResponseDto[];

  @ApiPropertyOptional({
    description: 'Projects associated with the team',
    type: () => [TeamRefDto],
  })
  projects?: TeamRefDto[];

  @ApiPropertyOptional({
    description: 'Tasks associated with the team',
    type: () => [TeamRefDto],
  })
  tasks?: TeamRefDto[];

  @ApiProperty({
    description: 'Whether the team is active',
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
