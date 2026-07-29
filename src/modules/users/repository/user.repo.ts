import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async isExist(email: string): Promise<boolean> {
    return this.repo.exists({ where: { email } });
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repo.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
        passwordHash: true,
      },
    });
  }

  async create(user: Partial<User>): Promise<User> {
    const result = await this.repo.insert({
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
    });
    return this.repo.findOneByOrFail({
      id: result.identifiers[0].id,
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  findUsers(): Promise<User[]> {
    return this.repo.find();
  }

  async deleteUser(id: string): Promise<void> {
    await this.repo.delete({ id });
  }

  async createWithRoles(
    user: Pick<User, 'name' | 'email' | 'passwordHash' | 'roles'>,
  ): Promise<User> {
    const result = await this.repo.insert({
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      roles: user.roles,
    });
    return this.repo.findOneByOrFail({
      id: result.identifiers[0].id,
    });
  }

  async activate(id: string): Promise<void> {
    await this.repo.update({ id }, { isActive: true });
  }

  async deactivate(id: string): Promise<void> {
    await this.repo.update({ id }, { isActive: false });
  }
}
