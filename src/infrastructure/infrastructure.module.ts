import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { QueueModule } from './queue/queue.module';
import { MailModule } from './mail/mail.module';
import { UploadModule } from './upload/upload.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    DatabaseModule,
    QueueModule,
    MailModule,
    UploadModule,
    LoggerModule,
  ],
})
export class InfrastructureModule {}
