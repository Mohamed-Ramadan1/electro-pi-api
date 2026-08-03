import {
  Controller,
  Get,
  Post,
  Delete,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Req,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { Request } from 'express';

import { NotificationsService } from '../service/notifications.service';
import { Protected, TransformResponseInterceptor } from '@common/index';
import {
  NotificationsListResponseDto,
  NotificationsCountResponseDto,
  MarkAsReadResponseDto,
} from '../dto/notification-response.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@Protected()
@UseInterceptors(TransformResponseInterceptor)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Get all notifications for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully.',
    type: NotificationsListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getNotifications(@Req() req: Request) {
    const notifications = await this.notificationsService.getNotifications(
      req.user.id,
    );
    return {
      message: 'Notifications retrieved successfully',
      notifications,
    };
  }

  @ApiOperation({ summary: 'Get the count of unread notifications' })
  @ApiResponse({
    status: 200,
    description: 'Notifications count retrieved successfully.',
    type: NotificationsCountResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @Get('count')
  @HttpCode(HttpStatus.OK)
  async count(@Req() req: Request) {
    const count = await this.notificationsService.count(req.user.id);
    return { message: 'Notifications count retrieved successfully', count };
  }

  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({
    status: 200,
    description: 'Notifications marked as read successfully.',
    type: MarkAsReadResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @Post('mark-read')
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Req() req: Request) {
    await this.notificationsService.markAsRead(req.user.id);
    return { message: 'Notifications marked as read successfully' };
  }

  @ApiOperation({ summary: 'Delete a specific notification' })
  @ApiParam({
    name: 'id',
    description: 'Notification UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Notification deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNotification(@Param('id') id: string, @Req() req: Request) {
    await this.notificationsService.deleteNotification(req.user.id, id);
    return { message: 'Notification deleted successfully' };
  }

  @ApiOperation({
    summary: 'Delete all notifications for the authenticated user',
  })
  @ApiResponse({
    status: 204,
    description: 'All notifications deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @Delete('all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllNotifications(@Req() req: Request) {
    await this.notificationsService.deleteAllNotifications(req.user.id);
    return { message: 'All notifications deleted successfully' };
  }
}
