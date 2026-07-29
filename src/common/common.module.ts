import { UsersModule } from '@modules/users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class CommonModule {}
