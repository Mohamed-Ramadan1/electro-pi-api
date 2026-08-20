import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CheckConflictDto {
  @ApiProperty({
    description: 'Start time of the range to check (ISO 8601)',
    example: '2026-08-20T10:00:00.000Z',
  })
  @IsDateString()
  startAt!: string;

  @ApiProperty({
    description: 'End time of the range to check (ISO 8601)',
    example: '2026-08-20T11:00:00.000Z',
  })
  @IsDateString()
  endAt!: string;
}
