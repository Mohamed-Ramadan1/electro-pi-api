import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UploadModule } from './upload/upload.module';
import { JwtModule } from './jwt/jwt.module';
import { SecurityPasswordModule } from './password/password.module';
import { QueuesModule } from './queues/queues.module';
import { MailsModule } from './mails/mails.module';

@Module({
  imports: [
    DatabaseModule,
    UploadModule,
    JwtModule,
    SecurityPasswordModule,
    QueuesModule,
    MailsModule,
  ],
})
export class InfrastructureModule {}
