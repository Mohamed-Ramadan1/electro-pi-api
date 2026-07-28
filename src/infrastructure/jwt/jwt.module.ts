import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as JwtMo } from '@nestjs/jwt';

import {
  createJwtInfrastructureConfig,
  createJwtModuleOptions,
} from './config/jwt.config';
import { JWT_CONFIG } from './constants/jwt.constants';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    JwtMo.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createJwtModuleOptions,
    }),
  ],
  providers: [
    {
      provide: JWT_CONFIG,
      inject: [ConfigService],
      useFactory: createJwtInfrastructureConfig,
    },
    TokenService,
  ],
  exports: [TokenService],
})
export class JwtModule {}
