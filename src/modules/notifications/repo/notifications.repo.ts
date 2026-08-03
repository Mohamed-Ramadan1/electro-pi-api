// NestJS imports
import { InjectRepository } from '@nestjs/typeorm';

// external package imports
import { Repository } from 'typeorm';

// Entity import
import { Notifications } from '../entity/notifications.entity';

export class NotificationsRepo {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,
  ) {}

  count(userid: string): Promise<number> {
    return this.notificationsRepository.count({
      where: {
        user: { id: userid },
      },
    });
  }

  findAll(userid: string): Promise<Notifications[]> {
    return this.notificationsRepository.find({
      where: {
        user: { id: userid },
      },
    });
  }
  findOne(id: string): Promise<Notifications | null> {
    return this.notificationsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async markAllRead(userId: string): Promise<void> {
    await this.notificationsRepository.update(
      { user: { id: userId }, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  async deleteNotification(
    userId: string,
    notificationId: string,
  ): Promise<void> {
    await this.notificationsRepository.delete({
      id: notificationId,
      user: { id: userId },
    });
  }

  async deleteNotifications(userId): Promise<void> {
    await this.notificationsRepository.delete({
      user: { id: userId },
    });
  }
}
