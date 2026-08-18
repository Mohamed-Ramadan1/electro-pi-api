import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@modules/users/entity/user.entity';

import { Team } from './teams.entity';
import {
  teamRoles,
  TeamRole,
  DEFAULT_TEAM_ROLE,
} from '../constants/teams.cons';

@Entity('team_members')
@Index(['team', 'user'], { unique: true })
export class TeamMember extends BaseEntity {
  @ManyToOne(() => Team, (team) => team.members, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'team_id' })
  team!: Team;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({
    type: 'enum',
    enum: teamRoles,
    default: DEFAULT_TEAM_ROLE,
  })
  role!: TeamRole;
}
