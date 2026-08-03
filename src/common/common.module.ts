import { UsersModule } from '@modules/users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@infrastructure/jwt/jwt.module';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [forwardRef(() => UsersModule), JwtModule],
  providers: [RolesGuard, AuthGuard],
  exports: [RolesGuard, AuthGuard],
})
export class CommonModule {}
