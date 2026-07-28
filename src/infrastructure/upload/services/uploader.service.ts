import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class UploaderService implements OnModuleInit {
  private readonly logger = new Logger(UploaderService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;
  private readonly keyPrefix: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
          '',
        ),
      },
      ...(this.configService.get('S3_ENDPOINT') && {
        endpoint: this.configService.get('S3_ENDPOINT'),
        forcePathStyle: this.configService.get('S3_FORCE_PATH_STYLE') === true,
      }),
    });

    this.bucket = this.configService.get<string>('S3_BUCKET_NAME', '');
    this.publicBaseUrl = this.configService.get<string>(
      'S3_PUBLIC_BASE_URL',
      '',
    );
    this.keyPrefix = this.configService.get<string>('S3_KEY_PREFIX', 'uploads');
  }

  onModuleInit() {
    this.logger.log('Uploader service initialized');
  }

  async uploadResource(
    file: UploadedFile,
    folder: string,
  ): Promise<{ key: string; url: string }> {
    const key = `${this.keyPrefix}/${folder}/${Date.now()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return { key, url: `${this.publicBaseUrl}/${key}` };
  }

  async deleteResource(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
