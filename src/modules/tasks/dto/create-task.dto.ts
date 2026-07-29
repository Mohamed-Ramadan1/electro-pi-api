import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { tasksPriority } from '../constants/taskst.const';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Design login page mockup',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Create a high-fidelity mockup for the login screen.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Project ID this task belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  @IsNotEmpty()
  projectId!: string;

  @ApiPropertyOptional({
    description: 'ID of the user to assign this task to',
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  })
  @IsOptional()
  @IsUUID('4')
  assigneeId?: string;

  @ApiPropertyOptional({
    description: 'Task priority',
    enum: Object.values(tasksPriority),
    default: Object.values(tasksPriority)[1],
    example: 'medium',
  })
  @IsOptional()
  @IsEnum(tasksPriority)
  priority?: string;

  @ApiPropertyOptional({
    description: 'Task due date (ISO 8601)',
    example: '2026-08-15T18:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({ strict: false })
  dueDate?: string;
}
