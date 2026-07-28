import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Res,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dto/index';
import { Public, TransformResponseInterceptor } from '@common/index';
import { Response } from 'express';
import ms from 'ms';

@Controller()
@Public()
@UseInterceptors(TransformResponseInterceptor)
export class AuthController {
  private readonly accessTokenTtl: number;
  private readonly refreshTokenTtl: number;
  private readonly accessTokenCookieName: string = 'access-token';
  private readonly refreshTokenCookieName: string = 'refresh-token';

  private readonly nodeEnv: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const accessTtl = this.configService.get<string>('JWT_ACCESS_TTL');
    this.nodeEnv = this.configService.get<string>('NODE_ENV', 'development');

    const refreshTtl = this.configService.get<string>('JWT_REFRESH_TTL');

    this.accessTokenTtl = ms(accessTtl as ms.StringValue);

    this.refreshTokenTtl = ms(refreshTtl as ms.StringValue);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body()
    registerDto: RegisterDto,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.register(registerDto);
    this.setAuthCookies(res, accessToken, refreshToken);
    return {
      message: 'User registered successfully',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body()
    loginDto: LoginDto,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);
    this.setAuthCookies(res, accessToken, refreshToken);
    return {
      message: 'User login success.',
    };
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    res.cookie(
      this.accessTokenCookieName,
      accessToken,
      this.cookieOptions(this.accessTokenTtl),
    );
    res.cookie(
      this.refreshTokenCookieName,
      refreshToken,
      this.cookieOptions(this.refreshTokenTtl),
    );
  }

  private cookieOptions(maxAge: number) {
    return {
      httpOnly: true,
      secure: this.nodeEnv === 'production',
      sameSite: 'lax' as const,
      maxAge,
    };
  }
  private setRequestCookies(
    res: Response,
    token: string,
    ttl: number,
    cookieName: string,
  ): void {
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: this.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: ttl,
    });
  }
}
