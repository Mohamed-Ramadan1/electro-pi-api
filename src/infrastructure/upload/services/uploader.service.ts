import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { promises as fs } from 'fs';
import path from 'path';

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
  private readonly region: string;
  private readonly localUploadsDir: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION', 'us-east-1');

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
          '',
        ),
      },
      ...(this.configService.get<string>('S3_ENDPOINT') && {
        endpoint: this.configService.get<string>('S3_ENDPOINT'),
        forcePathStyle:
          this.configService.get<string>('S3_FORCE_PATH_STYLE') === 'true',
      }),
    });

    this.bucket = this.configService.get<string>('S3_BUCKET_NAME', '');
    this.publicBaseUrl = this.configService.get<string>(
      'S3_PUBLIC_BASE_URL',
      '',
    );
    this.keyPrefix = this.configService.get<string>('S3_KEY_PREFIX', 'uploads');
    this.localUploadsDir = path.resolve(process.cwd(), 'uploads');
  }

  onModuleInit() {
    this.logger.log('Uploader service initialized');
  }

  async uploadResource(
    file: UploadedFile,
    folder: string,
  ): Promise<{ key: string; url: string }> {
    const key = `${this.keyPrefix}/${folder}/${Date.now()}-${file.originalname}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const url = this.publicBaseUrl
        ? `${this.publicBaseUrl}/${key}`
        : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

      this.logger.log(`Uploaded to S3: ${url}`);
      return { key, url };
    } catch (s3Err: unknown) {
      const err = s3Err as Record<string, unknown>;
      const metadata = (err?.$metadata as Record<string, unknown>) ?? {};
      this.logger.error(
        `S3 upload failed, falling back to local disk`,
        JSON.stringify(
          {
            bucket: this.bucket,
            region: this.region,
            key,
            errorCode: err?.Code ?? err?.code ?? 'UNKNOWN',
            errorMessage: err?.message ?? String(s3Err),
            requestId: metadata.requestId ?? 'N/A',
            httpStatusCode: metadata.httpStatusCode ?? 'N/A',
          },
          null,
          2,
        ),
      );

      const dir = path.join(this.localUploadsDir, folder);
      await fs.mkdir(dir, { recursive: true });

      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filename = `${Date.now()}-${safeName}`;
      const filePath = path.join(dir, filename);

      await fs.writeFile(filePath, file.buffer);

      const url = `/uploads/${folder}/${filename}`;
      this.logger.log(`Saved to disk: ${url}`);
      return { key: `local:${folder}/${filename}`, url };
    }
  }

  async deleteResource(key: string): Promise<void> {
    if (key.startsWith('local:')) {
      const relativePath = key.slice('local:'.length);
      const filePath = path.join(this.localUploadsDir, relativePath);
      await fs.unlink(filePath).catch(() => {});
      return;
    }

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async getSignedUrl(
    key: string | null,
    expiresInSeconds = 3600,
  ): Promise<string | null> {
    if (!key) return null;
    if (key.startsWith('local:')) {
      return `/uploads/${key.slice('local:'.length)}`;
    }
    if (key.startsWith('http://') || key.startsWith('https://')) {
      return key;
    }
    if (key.startsWith('/uploads/')) {
      return key;
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    });
  }
}
