import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { User } from '@modules/users/entity/user.entity';
import { Project } from '@modules/projects/entity/project.entity';
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
export class Task {
  @PrimaryColumn({
    type: 'uuid',
    default: () => 'gen_random_uuid()',
  })
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Index()
  @Column({
    type: 'enum',
    enum: tasksStatus,
    default: DEFAULT_TASKS_STATUS,
  })
  status!: TasksStatus;

  @Index()
  @Column({
    type: 'enum',
    enum: tasksPriority,
    default: DEFAULT_TASKS_PRIORITY,
  })
  priority!: TasksPriority;

  @Index()
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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
