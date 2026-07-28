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
}
