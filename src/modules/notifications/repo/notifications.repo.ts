// NestJS imports
import { InjectRepository } from '@nestjs/typeorm';

// external package imports
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

// Entity import
import { Notifications } from '../entity/notifications.entity';

//dto import
import { CreateNotificationDto } from '../dto/create-notification.dto';

export class NotificationsRepo {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,
  ) {}

  create(notificationData: CreateNotificationDto): Promise<Notifications> {
    const { userId, ...data } = notificationData;
    const notification = this.notificationsRepository.create({
      ...data,
      user: { id: userId },
    });
    return this.notificationsRepository.save(notification);
  }

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

  markAllRead(userId: string): Promise<UpdateResult> {
    return this.notificationsRepository.update(
      { user: { id: userId }, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  deleteNotification(
    userId: string,
    notificationId: string,
  ): Promise<DeleteResult> {
    return this.notificationsRepository.delete({
      id: notificationId,
      user: { id: userId },
    });
  }

  deleteNotifications(userId: string): Promise<DeleteResult> {
    return this.notificationsRepository.delete({
      user: { id: userId },
    });
  }
}
