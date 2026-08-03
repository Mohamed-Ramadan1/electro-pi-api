import { Injectable } from '@nestjs/common';

// repository imports
import { NotificationsRepo } from '../repo/notifications.repo';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepo: NotificationsRepo) {}
}
