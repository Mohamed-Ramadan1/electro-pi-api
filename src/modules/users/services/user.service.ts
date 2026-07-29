import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repo';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}
  userExists(email: string): Promise<boolean> {
    return this.userRepo.isExist(email);
  }

  create(userInfo: Partial<User>): Promise<User> {
    return this.userRepo.create(userInfo);
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepo.findByEmailWithPassword(email);
  }

  findById(id: string): Promise<User | null> {
    return this.userRepo.findById(id);
  }
}
