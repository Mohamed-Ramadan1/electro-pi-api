import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { User } from '@modules/users/entity/user.entity';
import {
  NotificationsType,
  NotificationType,
  DEFAULT_NOTIFICATION_TYPE,
} from '../constants/notifications.const';

@Entity('notifications')
export class Notifications extends BaseEntity {
  @ManyToOne(() => User, (user) => user.notifications, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({
    type: 'enum',
    enum: NotificationsType,
    default: DEFAULT_NOTIFICATION_TYPE,
  })
  type!: NotificationType;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'boolean', default: false })
  isRead!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt!: Date | null;

  @Column({ type: 'uuid', nullable: true })
  referenceId!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  referenceType!: string | null;
}
