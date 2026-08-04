import { Controller, Get, Post, Delete, Patch } from '@nestjs/common';

// service imports
import { RemindersService } from '../service/reminders.service';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly reminderService: RemindersService) {}

  @Get()
  getReminders() {}

  @Get(':id')
  getReminder() {}

  @Post()
  createReminder() {}

  @Delete(':id')
  deleteReminder() {}

  @Patch(':id')
  updateReminder() {}

  @Patch(':id')
  rescheduleReminder() {}

  @Patch(':id/toggle')
  toggleReminder() {}

  @Patch(':id/snooze')
  snoozeReminder() {}

  @Get('upcoming')
  getUpcomingReminders() {}

  @Post(':id/acknowledge')
  acknowledgeReminder() {}
}
