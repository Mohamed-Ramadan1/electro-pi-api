import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { JwtInfrastructureConfig } from '../types/jwt-config.type';
import { JwtPayload, VerifiedJwtPayload } from '../types/jwt-payload.type';
import { TokenPair } from '../types/token-pair.type';
import {
  JWT_CONFIG,
  JWT_ACCESS_TOKEN_TYPE,
  JWT_REFRESH_TOKEN_TYPE,
} from '../constants/jwt.constants';
@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    @Inject(JWT_CONFIG)
    private readonly config: JwtInfrastructureConfig,
  ) {}

  async issueAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(
      {
        ...payload,
        type: JWT_ACCESS_TOKEN_TYPE,
      },
      {
        audience: this.config.audience,
        expiresIn: this.config.accessTtl,
        issuer: this.config.issuer,
        secret: this.config.accessSecret,
      },
    );
  }

  async issueRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(
      {
        ...payload,
        jti: payload.jti ?? randomUUID(),
        type: JWT_REFRESH_TOKEN_TYPE,
      },
      {
        audience: this.config.audience,
        expiresIn: this.config.refreshTtl,
        issuer: this.config.issuer,
        secret: this.config.refreshSecret,
      },
    );
  }

  async issueTokenPair(payload: JwtPayload): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.issueAccessToken(payload),
      this.issueRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getAccessExpiresInSeconds(),
    };
  }

  async verifyAccessToken(token: string): Promise<VerifiedJwtPayload> {
    const payload = await this.jwt.verifyAsync<VerifiedJwtPayload>(token, {
      audience: this.config.audience,
      issuer: this.config.issuer,
      secret: this.config.accessSecret,
    });

    if (payload.type !== JWT_ACCESS_TOKEN_TYPE) {
      throw new Error('Invalid access token type');
    }

    return payload;
  }

  async verifyRefreshToken(token: string): Promise<VerifiedJwtPayload> {
    const payload = await this.jwt.verifyAsync<VerifiedJwtPayload>(token, {
      audience: this.config.audience,
      issuer: this.config.issuer,
      secret: this.config.refreshSecret,
    });

    if (payload.type !== JWT_REFRESH_TOKEN_TYPE) {
      throw new Error('Invalid refresh token type');
    }

    return payload;
  }

  decode(token: string): null | string | Record<string, unknown> {
    return this.jwt.decode(token);
  }

  getAccessExpiresInSeconds(): number {
    return ttlToSeconds(this.config.accessTtl);
  }
}

function ttlToSeconds(ttl: string | number): number {
  if (typeof ttl === 'number') {
    return ttl;
  }

  const match = /^(\d+)(ms|[smhdwy])?$/.exec(ttl.trim());

  if (!match) {
    return 0;
  }

  const value = Number(match[1]);
  const unit = match[2] ?? 's';

  const multipliers: Record<string, number> = {
    ms: 1 / 1000,
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
    w: 7 * 24 * 60 * 60,
    y: 365 * 24 * 60 * 60,
  };

  return value * multipliers[unit];
}
