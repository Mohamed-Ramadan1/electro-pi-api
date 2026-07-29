import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { tasksStatus } from '../constants/taskst.const';

export class UpdateTaskStatusDto {
  @ApiProperty({
    description: 'Task status',
    enum: Object.values(tasksStatus),
    example: 'done',
  })
  @IsEnum(tasksStatus)
  @IsNotEmpty()
  status!: string;
}
