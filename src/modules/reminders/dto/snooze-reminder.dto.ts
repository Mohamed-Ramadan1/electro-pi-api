import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class SnoozeReminderDto {
  @ApiProperty({
    description: 'Number of minutes to snooze the reminder',
    example: 10,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  snoozeInMinutes!: number;
}
