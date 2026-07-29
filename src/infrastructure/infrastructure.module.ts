import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UploadModule } from './upload/upload.module';
import { JwtModule } from './jwt/jwt.module';
import { SecurityPasswordModule } from './password/password.module';

@Module({
  imports: [DatabaseModule, UploadModule, JwtModule, SecurityPasswordModule],
})
export class InfrastructureModule {}
