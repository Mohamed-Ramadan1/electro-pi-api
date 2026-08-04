import { BaseEntity } from '@common/index';
import { Column, Entity, JoinColumn, ManyToOne, Index } from 'typeorm';
import { User } from '@modules/users/entity/user.entity';
import {
  RepeatInterval,
  RepeatIntervalType,
  DEFAULT_REPEAT_INTERVAL,
} from '../const/repeatInterval.const';

@Entity('reminders')
@Index(['reminderAt', 'isSent'])
export class Reminder extends BaseEntity {
  @ManyToOne(() => User, (user) => user.reminders, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', length: 150, nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  reminderMessage!: string;

  @Column({ type: 'timestamptz', nullable: false })
  reminderAt!: Date;
  @Column({ type: 'int', nullable: true, default: 1 })
  repeatCount!: number | null;

  /*  when chose repeat count greater than one time */
  @Column({ type: 'int', nullable: true, default: null })
  snoozeMinutes!: number | null;

  @Column({
    type: 'enum',
    enum: RepeatInterval, // e.g. NONE, DAILY, WEEKLY, MONTHLY, CUSTOM
    default: DEFAULT_REPEAT_INTERVAL,
  })
  repeatInterval!: RepeatIntervalType;

  @Column({ type: 'boolean', default: false })
  isSent!: boolean;

  @Column({ type: 'boolean', default: false })
  isCompleted!: boolean; // or isDismissed

  @Column({ type: 'timestamptz', nullable: true })
  nextTriggerAt!: Date | null;
}
