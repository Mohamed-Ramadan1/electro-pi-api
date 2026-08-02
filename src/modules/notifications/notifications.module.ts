import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from './entity/notifications.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Notifications])],
})
export class NotificationsModule {}
