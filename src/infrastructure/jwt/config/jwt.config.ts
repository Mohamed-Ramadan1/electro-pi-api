import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { StringValue } from 'ms';
import {
  JWT_DEFAULT_ACCESS_TTL,
  JWT_DEFAULT_AUDIENCE,
  JWT_DEFAULT_ISSUER,
  JWT_DEFAULT_REFRESH_TTL,
  JWT_DEV_ACCESS_SECRET,
  JWT_DEV_REFRESH_SECRET,
} from '../constants/jwt.constants';
import { JwtInfrastructureConfig } from '../types/jwt-config.type';

export function createJwtInfrastructureConfig(
  config: ConfigService,
): JwtInfrastructureConfig {
  const environment = config.get<string>('NODE_ENV', 'development');
  const accessSecret = config.get<string>('JWT_ACCESS_SECRET');
  const refreshSecret = config.get<string>('JWT_REFRESH_SECRET');

  if (environment === 'production' && (!accessSecret || !refreshSecret)) {
    throw new Error(
      'JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are required in production.',
    );
  }

  return {
    accessSecret: accessSecret || JWT_DEV_ACCESS_SECRET,
    refreshSecret: refreshSecret || JWT_DEV_REFRESH_SECRET,
    accessTtl: getJwtTtl(
      config.get<string>('JWT_ACCESS_TTL'),
      JWT_DEFAULT_ACCESS_TTL,
    ),
    refreshTtl: getJwtTtl(
      config.get<string>('JWT_REFRESH_TTL'),
      JWT_DEFAULT_REFRESH_TTL,
    ),
    issuer: config.get<string>('JWT_ISSUER', JWT_DEFAULT_ISSUER),
    audience: config.get<string>('JWT_AUDIENCE', JWT_DEFAULT_AUDIENCE),
  };
}

function getJwtTtl(
  value: string | undefined,
  fallback: StringValue,
): StringValue {
  if (!value) {
    return fallback;
  }

  return /^(\d+)(ms|s|m|h|d|w|y)?$/.test(value)
    ? (value as StringValue)
    : fallback;
}

export function createJwtModuleOptions(
  config: ConfigService,
): JwtModuleOptions {
  const jwtConfig = createJwtInfrastructureConfig(config);

  return {
    secret: jwtConfig.accessSecret,
    signOptions: {
      audience: jwtConfig.audience,
      expiresIn: jwtConfig.accessTtl,
      issuer: jwtConfig.issuer,
    },
  };
}
