import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

// modules imports
import { UsersModule } from '@modules/users/users.module';

// common imports
import { AllExceptionsFilter, AuthGuard } from '@common/index';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 1 minute
        limit: 250, // 60 requests per minute
      },
      {
        name: 'strict',
        ttl: 60000, // 1 minute
        limit: 250, // For sensitive endpoints
      },
      {
        name: 'auth',
        ttl: 900000, // 15 minutes
        limit: 35, // For login/signup
      },
    ]),

    ConfigModule.forRoot({
      cache: true,
      envFilePath: '.env',
      isGlobal: true,
    }),
    UsersModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class CoreModule {}
