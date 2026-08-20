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
import { Project } from '@modules/projects/entity/project.entity';
import { Team } from '@modules/teams/entity/teams.entity';
import { TaskImage } from './task-image.entity';
import {
  tasksStatus,
  TasksStatus,
  DEFAULT_TASKS_STATUS,
  tasksPriority,
  TasksPriority,
  DEFAULT_TASKS_PRIORITY,
} from '../constants/taskst.const';

@Entity('tasks')
export class Task extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({
    type: 'enum',
    enum: tasksStatus,
    default: DEFAULT_TASKS_STATUS,
  })
  status!: TasksStatus;

  @Column({
    type: 'enum',
    enum: tasksPriority,
    default: DEFAULT_TASKS_PRIORITY,
  })
  priority!: TasksPriority;

  @Column({ type: 'timestamp', nullable: true })
  dueDate!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completedAt!: Date | null;

  @OneToMany(() => TaskImage, (image) => image.task, { cascade: true })
  images!: TaskImage[];

  @ManyToOne(() => Project, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'creator_id' })
  creator!: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignee_id' })
  assignee!: User | null;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'task_assignees',
    joinColumn: { name: 'task_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  assignees!: User[];

  @ManyToMany(() => Team, (team) => team.tasks)
  @JoinTable({
    name: 'task_teams',
    joinColumn: { name: 'task_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'team_id', referencedColumnName: 'id' },
  })
  teams!: Team[];
}
