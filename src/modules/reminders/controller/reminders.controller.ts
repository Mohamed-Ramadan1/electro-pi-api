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

import { Request } from 'express';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiExtraModels,
} from '@nestjs/swagger';

//dto imports
import { CreateReminderDto } from '../dto/create-reminder.dto';
import { UpdateReminderDto } from '../dto/update-reminder.dto';
import { ReminderResponseDto } from '../dto/reminder-response.dto';
import { RescheduleReminderDto } from '../dto/reschedule-reminder.dto';
import { SnoozeReminderDto } from '../dto/snooze-reminder.dto';

// common imports
import { Protected, TransformResponseInterceptor } from '@common/index';

// service imports
import { RemindersService } from '../service/reminders.service';

@ApiTags('Reminders')
@ApiBearerAuth()
@ApiExtraModels(ReminderResponseDto)
@Controller('reminders')
@Protected()
@UseInterceptors(TransformResponseInterceptor)
export class RemindersController {
  constructor(private readonly reminderService: RemindersService) {}

  @ApiOperation({ summary: 'List all reminders for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Reminders retrieved successfully.',
    type: [ReminderResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getReminders(@Req() req: Request) {
    const reminders = await this.reminderService.getReminders(req.user.id);
    return {
      message: 'Reminders retrieved successfully.',
      reminders,
    };
  }

  @ApiOperation({
    summary: 'List upcoming reminders for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Upcoming reminders retrieved successfully.',
    type: [ReminderResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @HttpCode(HttpStatus.OK)
  @Get('upcoming')
  async getUpcomingReminders(@Req() req: Request) {
    const reminders = await this.reminderService.getUpcomingReminders(
      req.user.id,
    );
    return {
      message: 'Reminders retrieved successfully.',
      reminders,
    };
  }

  @ApiOperation({ summary: 'Get a single reminder by ID' })
  @ApiParam({ name: 'id', description: 'Reminder UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Reminder retrieved successfully.',
    type: ReminderResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getReminder(@Param('id') id: string, @Req() req: Request) {
    const reminder = await this.reminderService.getReminder(req.user.id, id);
    return {
      message: 'Reminder retrieved successfully.',
      reminder,
    };
  }

  @ApiOperation({ summary: 'Create a new reminder' })
  @ApiResponse({
    status: 201,
    description: 'Reminder created successfully.',
    type: ReminderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createReminder(
    @Body() reminderData: CreateReminderDto,
    @Req() req: Request,
  ) {
    const reminder = await this.reminderService.createReminder(
      req.user.id,
      reminderData,
    );
    return {
      message: 'Reminder created successfully.',
      reminder,
    };
  }

  @ApiOperation({ summary: 'Delete all reminders for the authenticated user' })
  @ApiResponse({ status: 204, description: 'Reminders deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteReminders(@Req() req: Request) {
    await this.reminderService.deleteReminders(req.user.id);
    return {
      message: 'Reminders deleted successfully.',
    };
  }

  @ApiOperation({ summary: 'Delete a single reminder by ID' })
  @ApiParam({ name: 'id', description: 'Reminder UUID', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Reminder deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteReminder(@Param('id') id: string, @Req() req: Request) {
    await this.reminderService.deleteReminder(req.user.id, id);
    return {
      message: 'Reminder deleted successfully.',
    };
  }

  @ApiOperation({ summary: 'Update a reminder by ID' })
  @ApiParam({ name: 'id', description: 'Reminder UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Reminder updated successfully.',
    type: ReminderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateReminder(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateReminderData: UpdateReminderDto,
  ) {
    const reminder = await this.reminderService.updateReminder(
      req.user.id,
      id,
      updateReminderData,
    );
    return {
      message: 'Reminder updated successfully.',
      reminder,
    };
  }

  @ApiOperation({ summary: 'Reschedule a reminder by ID' })
  @ApiParam({ name: 'id', description: 'Reminder UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Reminder rescheduled successfully.',
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/reschedule')
  async rescheduleReminder(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() data: RescheduleReminderDto,
  ) {
    await this.reminderService.rescheduleReminder(req.user.id, id, data);
    return {
      message: 'Reminders rescheduled  successfully.',
    };
  }

  @ApiOperation({ summary: 'Toggle active status of a reminder' })
  @ApiParam({ name: 'id', description: 'Reminder UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Reminder toggled successfully.',
    type: ReminderResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/toggle')
  async toggleReminder(@Req() req: Request, @Param('id') id: string) {
    const reminder = await this.reminderService.toggleReminder(req.user.id, id);
    return {
      message: 'Reminders retrieved successfully.',
      reminder,
    };
  }

  @ApiOperation({ summary: 'Acknowledge / mark a reminder as done' })
  @ApiParam({ name: 'id', description: 'Reminder UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Reminder acknowledged successfully.',
    type: ReminderResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/acknowledge')
  async acknowledgeReminder(@Req() req: Request, @Param('id') id: string) {
    const reminder = await this.reminderService.acknowledgeReminder(
      req.user.id,
      id,
    );
    return {
      message: 'Reminders marked as done  successfully.',
      reminder,
    };
  }

  @ApiOperation({ summary: 'Snooze a reminder by a number of minutes' })
  @ApiParam({ name: 'id', description: 'Reminder UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Reminder snoozed successfully.',
    type: ReminderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Reminder not found.' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/snooze')
  async snoozeReminder(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() data: SnoozeReminderDto,
  ) {
    const reminder = await this.reminderService.snoozeReminder(
      req.user.id,
      id,
      data,
    );
    return {
      message: 'Reminder snoozed successfully.',
      reminder,
    };
  }
}
