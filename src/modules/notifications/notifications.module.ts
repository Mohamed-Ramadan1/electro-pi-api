import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from './entity/notifications.entity';
import { NotificationsController } from './controller/notifications.controller';
import { NotificationsService } from './service/notifications.service';
import { NotificationsRepo } from '../notifications/repo/notifications.repo';
@Module({
  imports: [TypeOrmModule.forFeature([Notifications])],
  providers: [NotificationsService, NotificationsRepo],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
