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
}
