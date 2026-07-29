import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from '@modules/users/users.module';
import { JwtModule } from '@infrastructure/jwt/jwt.module';
import { SecurityPasswordModule } from '@infrastructure/password/password.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthGuard } from '@common/index';

@Module({
  imports: [UsersModule, JwtModule, SecurityPasswordModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
