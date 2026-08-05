import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  HttpCode,
  Req,
  HttpStatus,
  UseInterceptors,
  Param,
  Body,
} from '@nestjs/common';

//express imports
import { Request } from 'express';

//dto imports
import { CreateReminderDto } from '../dto/create-reminder.dto';
import { UpdateReminderDto } from '../dto/update-reminder.dto';

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
  async getReminders(@Req() req: Request) {
    const reminders = await this.reminderService.getReminders(req.user.id);
    return {
      message: 'Reminders retrieved successfully.',
      reminders,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getReminder(@Param('id') id: string, @Req() req: Request) {
    const reminder = await this.reminderService.getReminder(req.user.id, id);
    return {
      message: 'Reminders retrieved successfully.',
      reminder,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createReminder(
    @Body() reminderData: CreateReminderDto,
    @Req() req: Request,
  ) {
    await this.reminderService.createReminder(req.user.id, reminderData);
    return {
      message: 'Reminders created successfully.',
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('')
  async deleteReminder(@Req() req: Request) {
    await this.reminderService.deleteReminders(req.user.id);
    return {
      message: 'Reminders retrieved successfully.',
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteReminders(@Param('id') id: string, @Req() req: Request) {
    await this.reminderService.deleteReminder(req.user.id, id);
    return {
      message: 'Reminders retrieved successfully.',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateReminder(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateReminderData: UpdateReminderDto,
  ) {
    await this.reminderService.updateReminder(
      req.user.id,
      id,
      updateReminderData,
    );

    return {
      message: 'Reminder updated successfully.',
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
