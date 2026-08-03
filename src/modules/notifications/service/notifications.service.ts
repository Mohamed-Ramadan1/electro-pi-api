import { Injectable } from '@nestjs/common';

// repository imports
import { NotificationsRepo } from '../repo/notifications.repo';

import { Notifications } from '../entity/notifications.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepo: NotificationsRepo) {}

  async count(userid: string): Promise<number> {
    return this.notificationsRepo.count(userid);
  }
  getNotifications(userId: string): Promise<Notifications[]> {
    return this.notificationsRepo.findAll(userId);
  }
  markAsRead(userId: string): Promise<UpdateResult> {
    return this.notificationsRepo.markAllRead(userId);
  }

  deleteNotification(
    userId: string,
    notificationId: string,
  ): Promise<DeleteResult> {
    return this.notificationsRepo.deleteNotification(userId, notificationId);
  }

  deleteAllNotifications(userId: string): Promise<DeleteResult> {
    return this.notificationsRepo.deleteNotifications(userId);
  }
}
