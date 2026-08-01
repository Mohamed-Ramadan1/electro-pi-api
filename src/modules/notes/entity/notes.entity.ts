import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/index';
import { User } from '@modules/users/entity/user.entity';

@Entity('notes')
export class Notes extends BaseEntity {
  @ManyToOne(() => User, (user) => user.notes, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  content!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageKey!: string | null;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  imageUrl!: string | null;
}
