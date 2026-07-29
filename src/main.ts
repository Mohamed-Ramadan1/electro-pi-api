import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configureApplication, setupSwagger, toBoolean } from '@core/index';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  configureApplication(app);

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';

  const enableSwagger = toBoolean(
    configService.get('ENABLE_SWAGGER'),
    nodeEnv !== 'production',
  );
  if (enableSwagger) {
    setupSwagger(app);
  }

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
