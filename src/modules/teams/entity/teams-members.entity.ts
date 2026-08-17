import { BaseEntity } from '@common/index';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@modules/users/entity/user.entity';

import { TeamsEntity } from './teams.entity';
import {
  teamRoles,
  TeamRole,
  DEFAULT_TEAM_ROLE,
} from '../constants/teams.cons';

@Entity('team_members')
@Index(['team', 'user'], { unique: true })
export class TeamMemberEntity extends BaseEntity {
  @ManyToOne(() => TeamsEntity, (team) => team.members, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'team_id' })
  team!: TeamsEntity;

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
