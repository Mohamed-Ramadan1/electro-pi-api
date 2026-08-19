import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTeamDto {
  @ApiPropertyOptional({
    description: 'Team name',
    example: 'Platform Engineering',
    minLength: 2,
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

  @ApiPropertyOptional({
    description: 'Unique team key',
    example: 'platform-eng',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  key?: string;

  @ApiPropertyOptional({
    description: 'Team description',
    example: 'Owns the core platform services and infrastructure.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Team avatar URL',
    example: 'https://cdn.example.com/avatars/platform-eng.png',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'IDs of users to set as team members',
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    ],
    isArray: true,
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return [value];
      }
    }
    return [];
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  members?: string[];

  @ApiPropertyOptional({
    description: 'IDs of projects to associate with the team',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    isArray: true,
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return [value];
      }
    }
    return [];
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  projects?: string[];

  @ApiPropertyOptional({
    description: 'IDs of tasks to associate with the team',
    example: ['6ba7b810-9dad-11d1-80b4-00c04fd430c8'],
    isArray: true,
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return [value];
      }
    }
    return [];
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tasks?: string[];
}
