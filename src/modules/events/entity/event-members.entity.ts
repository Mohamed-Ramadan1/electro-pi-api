import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { User } from '@modules/users/entity/user.entity';

import { Event } from './event.entity';
import {
  eventRoles,
  EventRole,
  DEFAULT_EVENT_ROLE,
  invitationStatus,
  InvitationStatus,
  DEFAULT_INVITATION_STATUS,
} from '../constants/events.cons';

@Entity('event_members')
@Index(['event', 'user'], { unique: true })
export class EventMember extends BaseEntity {
  @ManyToOne(() => Event, (event) => event.members, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({
    type: 'enum',
    enum: eventRoles,
    default: DEFAULT_EVENT_ROLE,
  })
  role!: EventRole;

  @Column({
    type: 'enum',
    enum: invitationStatus,
    default: DEFAULT_INVITATION_STATUS,
  })
  status!: InvitationStatus;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'creator_id' })
  creator!: User;
}
