import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { User } from '@modules/users/entity/user.entity';

import { EventMember } from './event-members.entity';

@Entity('events')
export class Event extends BaseEntity {
  @Column({ type: 'varchar', length: 150, nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'timestamptz', nullable: false })
  startAt!: Date;

  @Column({ type: 'timestamptz', nullable: false })
  endAt!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  meetingLink!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  theme!: string | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'creator_id' })
  creator!: User;

  @OneToMany(() => EventMember, (eventMember) => eventMember.event, {
    cascade: true,
  })
  members!: EventMember[];
}
