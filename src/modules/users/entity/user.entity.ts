import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  Column,
  Index,
} from 'typeorm';

import {
  UserRoles,
  UserRole,
  DEFAULT_ROLE,
} from '@common/constants/roles.constants';

@Entity('users')
export class User {
  @PrimaryColumn({
    type: 'uuid',
    default: () => 'gen_random_uuid()',
  })
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', unique: true, length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  passwordHash!: string;

  @Index()
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  // Option A: native Postgres array of an enum
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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  termsAcceptedAt!: Date | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  termsVersion!: string | null;
}
