import { Injectable } from '@nestjs/common';

// repository imports
import { NotificationsRepo } from '../repo/notifications.repo';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepo: NotificationsRepo) {}

  async count(userid: string): Promise<number> {
    return this.notificationsRepo.count(userid);
  }
  markAsRead() {}
  getNotifications() {}
  deleteNotification() {}

  createNotification() {}
}
