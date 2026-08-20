import { BaseEntity } from '@common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from '@modules/users/entity/user.entity';
import { Project } from '@modules/projects/entity/project.entity';
import { Task } from '@modules/tasks/entity/task.entity';

import { TeamMember } from './teams-members.entity';

@Entity('teams')
export class Team extends BaseEntity {
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

  @OneToMany(() => TeamMember, (teamMember) => teamMember.team, {
    cascade: true,
  })
  members!: TeamMember[];

  @ManyToMany(() => Project, (project) => project.teams)
  projects!: Project[];

  @ManyToMany(() => Task, (task) => task.teams)
  tasks!: Task[];
}
