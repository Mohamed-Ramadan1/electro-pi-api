import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTeamDto {
  @ApiProperty({
    description: 'Team name',
    example: 'Platform Engineering',
    minLength: 2,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  name!: string;

  @ApiProperty({
    description: 'Unique team key',
    example: 'platform-eng',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  key!: string;

  @ApiProperty({
    description: 'Team description',
    example: 'Owns the core platform services and infrastructure.',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({
    description: 'Team avatar URL',
    example: 'https://cdn.example.com/avatars/platform-eng.png',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'IDs of users to add as team members',
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
}
