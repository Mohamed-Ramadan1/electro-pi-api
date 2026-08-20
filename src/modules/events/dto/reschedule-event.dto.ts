import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class RescheduleEventDto {
  @ApiProperty({
    description: 'New event start time (ISO 8601)',
    example: '2026-08-21T10:00:00.000Z',
  })
  @IsDateString()
  startAt!: string;

  @ApiProperty({
    description: 'New event end time (ISO 8601)',
    example: '2026-08-21T11:00:00.000Z',
  })
  @IsDateString()
  endAt!: string;
}
