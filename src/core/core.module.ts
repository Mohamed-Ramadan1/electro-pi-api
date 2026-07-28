import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { RouterModule, APP_FILTER, APP_GUARD } from '@nestjs/core';

// modules imports
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';

// common imports
import { AllExceptionsFilter, AuthGuard } from '@common/index';

@Module({
  imports: [
    RouterModule.register([
      { path: 'auth', module: AuthModule },
      {
        path: 'user',
        module: UsersModule,
      },
    ]),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 1 minute
        limit: 60, // 60 requests per minute
      },
      {
        name: 'strict',
        ttl: 60000, // 1 minute
        limit: 10, // For sensitive endpoints
      },
      {
        name: 'auth',
        ttl: 900000, // 15 minutes
        limit: 5, // For login/signup
      },
    ]),

    ConfigModule.forRoot({
      cache: true,
      envFilePath: '.env',
      isGlobal: true,
    }),
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
