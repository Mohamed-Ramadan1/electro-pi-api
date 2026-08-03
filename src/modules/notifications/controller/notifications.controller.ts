import { Controller, Get, Post, Delete } from '@nestjs/common';

//service imports
import { NotificationsService } from '../service/notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications() {}

  @Get('count')
  count() {}

  @Post('mark-read')
  markAsRead() {}
  @Delete(':id')
  deleteNotification() {}

  @Delete('all')
  deleteAllNotifications() {}
}
