import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { BaseEntity } from '@common/index';
import {
  UserRoles,
  UserRole,
  DEFAULT_ROLE,
} from '@common/constants/roles.constants';
import { Notes } from '@modules/notes/entity/notes.entity';
import { Task } from '@modules/tasks/entity/task.entity';
import { Project } from '@modules/projects/entity/project.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', unique: true, length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    array: true,
    default: [DEFAULT_ROLE],
  })
  roles!: UserRole[];

  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
  })
  profileImage!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  termsAcceptedAt!: Date | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  termsVersion!: string | null;

  @OneToMany(() => Notes, (note) => note.user)
  notes!: Notes[];

  @OneToMany(() => Task, (task) => task.creator)
  createdTasks!: Task[];

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks!: Task[];

  @OneToMany(() => Project, (project) => project.creator)
  createdProjects!: Project[];

  @ManyToMany(() => Project, (project) => project.members)
  memberProjects!: Project[];
}
