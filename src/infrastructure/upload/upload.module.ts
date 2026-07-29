import { Module } from '@nestjs/common';
import { UploaderService } from './services/uploader.service';

@Module({
  providers: [UploaderService],
  exports: [UploaderService],
})
export class UploadModule {}
