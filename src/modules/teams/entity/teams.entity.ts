import { BaseEntity } from '@common/index';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '@modules/users/entity/user.entity';

import { TeamMemberEntity } from './teams-members.entity';

@Entity('teams')
export class TeamsEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  name!: string;

  @Column({ unique: true, length: 20 })
  key!: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description!: string;

  @Column({ nullable: true })
  avatar?: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'creator_id' })
  creator!: User;

  @OneToMany(() => TeamMemberEntity, (teamMember) => teamMember.team, {
    cascade: true,
  })
  members!: TeamMemberEntity[];
}
