import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { User } from '@modules/users/entity/user.entity';
import { Task } from '@modules/tasks/entity/task.entity';
import { Team } from '@modules/teams/entity/teams.entity';
import {
  projectStatus,
  ProjectStatus,
  DEFAULT_PROJECT_STATUS,
} from '../constants/projects.cons';

@Entity('projects')
export class Project extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  createdIn!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({
    type: 'enum',
    enum: projectStatus,
    default: DEFAULT_PROJECT_STATUS,
  })
  projectStatus!: ProjectStatus;

  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
  })
  projectImage!: string | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'creator_id' })
  creator!: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'project_members',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  members!: User[];

  @ManyToMany(() => Team)
  @JoinTable({
    name: 'project_teams',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'team_id', referencedColumnName: 'id' },
  })
  teams!: Team[];

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[];
}
