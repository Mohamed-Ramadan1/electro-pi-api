import {
  Controller,
  Get,
  Post,
  Delete,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';

// express imports
import { Request } from 'express';

//service imports
import { NotificationsService } from '../service/notifications.service';
import { Protected, TransformResponseInterceptor } from '@common/index';

@Controller('notifications')
@Protected()
@UseInterceptors(TransformResponseInterceptor)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getNotifications() {
    this.notificationsService.getNotifications();
  }

  @HttpCode(HttpStatus.OK)
  @Get('count')
  async count(@Req() req: Request) {
    const count = await this.notificationsService.count(req.user.id);
    return { message: 'Notifications count retrieved successfully', count };
  }

  @HttpCode(HttpStatus.OK)
  @Post('mark-read')
  markAsRead() {
    this.notificationsService.markAsRead();
    return { message: 'Notifications marked as read successfully' };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteNotification() {
    this.notificationsService.deleteNotification();
    return { message: 'Notification deleted successfully' };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('all')
  deleteAllNotifications() {
    this.notificationsService.deleteNotification();
    return { message: 'All notifications deleted successfully' };
  }
}
