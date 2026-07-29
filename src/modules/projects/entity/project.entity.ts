import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Index,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';

import { User } from '@modules/users/entity/user.entity';
import {
  projectStatus,
  ProjectStatus,
  DEFAULT_PROJECT_STATUS,
} from '../constants/projects.cons';

@Entity('projects')
export class Project {
  @PrimaryColumn({
    type: 'uuid',
    default: () => 'gen_random_uuid()',
  })
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  createdIn!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @Index()
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Index()
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
}
