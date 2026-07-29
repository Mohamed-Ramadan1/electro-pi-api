import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repo';
import { PasswordService } from '@infrastructure/index';
import { UserRole, DEFAULT_ROLE } from '@common/index';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  userExists(email: string): Promise<boolean> {
    return this.userRepo.isExist(email);
  }

  create(userInfo: Partial<User>): Promise<User> {
    return this.userRepo.create(userInfo);
  }

  async createWithRoles(
    name: string,
    email: string,
    password: string,
    roles?: UserRole[],
  ): Promise<User> {
    const assignedRoles = roles?.length ? roles : [DEFAULT_ROLE];
    const passwordHash = await this.passwordService.hash(password);
    return this.userRepo.createWithRoles({
      name,
      email,
      passwordHash,
      roles: assignedRoles,
    });
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepo.findByEmailWithPassword(email);
  }

  findById(id: string): Promise<User | null> {
    return this.userRepo.findById(id);
  }

  async findUsers(): Promise<User[]> {
    return this.userRepo.findUsers();
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepo.deleteUser(id);
  }

  async activateUser(id: string): Promise<void> {
    await this.userRepo.activate(id);
  }

  async deactivateUser(id: string): Promise<void> {
    await this.userRepo.deactivate(id);
  }
}
