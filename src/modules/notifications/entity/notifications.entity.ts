import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/index';
import { User } from '@modules/users/entity/user.entity';
@Entity('notifications')
export class Notifications extends BaseEntity {
  @ManyToOne(() => User, (user) => user.notes, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', length: 255 })
  notification!: string;
}
