import { Module } from '@nestjs/common';
import { UsersModule } from '@modules/users/users.module';
import { JwtModule } from '@infrastructure/jwt/jwt.module';
import { SecurityPasswordModule } from '@infrastructure/password/password.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [UsersModule, JwtModule, SecurityPasswordModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
