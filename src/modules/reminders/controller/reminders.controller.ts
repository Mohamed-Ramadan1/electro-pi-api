import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';

// common imports
import { Protected, TransformResponseInterceptor } from '@common/index';

// service imports
import { RemindersService } from '../service/reminders.service';

@Controller('reminders')
@Protected()
@UseInterceptors(TransformResponseInterceptor)
export class RemindersController {
  constructor(private readonly reminderService: RemindersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getReminders() {
    this.reminderService.getReminders();
    return {
      message: 'Reminders retrieved successfully.',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getReminder() {
    this.reminderService.getReminder();
    return {
      message: 'Reminders retrieved successfully.',
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createReminder() {
    this.reminderService.createReminder();
    return {
      message: 'Reminders retrieved successfully.',
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteReminder() {
    this.reminderService.deleteReminders();
    return {
      message: 'Reminders retrieved successfully.',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  updateReminder() {
    this.reminderService.updateReminder();
    return {
      message: 'Reminders retrieved successfully.',
    };
  }

  @Patch(':id')
  rescheduleReminder() {
    this.reminderService.rescheduleReminder();
    return {
      message: 'Reminders retrieved successfully.',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id/toggle')
  toggleReminder() {
    this.reminderService.toggleReminder();
    return {
      message: 'Reminders retrieved successfully.',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id/snooze')
  snoozeReminder() {
    this.reminderService.snoozeReminder();
    return {
      message: 'Reminders retrieved successfully.',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('upcoming')
  getUpcomingReminders() {
    this.reminderService.getUpcomingReminders();
    return {
      message: 'Reminders retrieved successfully.',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/acknowledge')
  acknowledgeReminder() {
    this.reminderService.acknowledgeReminder();
    return {
      message: 'Reminders retrieved successfully.',
    };
  }
}
