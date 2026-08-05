import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class RescheduleReminderDto {
  @ApiProperty({
    description: 'New date and time for the reminder (ISO 8601)',
    example: '2026-08-10T14:00:00.000Z',
  })
  @IsDateString({ strict: false })
  @IsNotEmpty()
  newDate!: string;
}
