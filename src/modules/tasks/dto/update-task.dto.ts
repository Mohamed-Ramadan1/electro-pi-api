import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  tasksStatus,
  tasksPriority,
} from '../constants/taskst.const';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Task title',
    example: 'Design login page mockup',
    minLength: 2,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Create a high-fidelity mockup for the login screen.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Task status',
    enum: Object.values(tasksStatus),
    example: 'inprogress',
  })
  @IsOptional()
  @IsEnum(tasksStatus)
  status?: string;

  @ApiPropertyOptional({
    description: 'Task priority',
    enum: Object.values(tasksPriority),
    example: 'high',
  })
  @IsOptional()
  @IsEnum(tasksPriority)
  priority?: string;

  @ApiPropertyOptional({
    description: 'Task due date (ISO 8601)',
    example: '2026-08-15T18:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({ strict: false } as any)
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'ID of the user to assign this task to',
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  })
  @IsOptional()
  @IsUUID('4')
  assigneeId?: string;
}
