import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/index';
import { Task } from './task.entity';

@Entity('task_images')
export class TaskImage extends BaseEntity {
  @Column({ type: 'varchar', length: 500 })
  key!: string;

  @Column({ type: 'varchar', length: 2000 })
  url!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @ManyToOne(() => Task, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task!: Task;
}
