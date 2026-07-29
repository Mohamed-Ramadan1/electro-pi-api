import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserController } from './controller/user.controller';
import { UserRepository } from './repository/user.repo';
import { CommonModule } from '@common/common.module';
import { SecurityPasswordModule } from '@infrastructure/password/password.module';
import { MembersController } from './controller/members.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SecurityPasswordModule,
    forwardRef(() => CommonModule),
  ],
  controllers: [UserController, MembersController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UsersModule {}
