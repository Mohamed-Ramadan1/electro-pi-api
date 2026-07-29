import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Task } from './task.entity';

@Entity('task_images')
export class TaskImage {
  @PrimaryColumn({
    type: 'uuid',
    default: () => 'gen_random_uuid()',
  })
  id!: string;

  @Column({ type: 'varchar', length: 500 })
  key!: string;

  @Column({ type: 'varchar', length: 2000 })
  url!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @ManyToOne(() => Task, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task!: Task;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}
