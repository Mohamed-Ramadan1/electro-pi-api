import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dto/index';
import { Public, TransformResponseInterceptor } from '@common/index';
import { Response } from 'express';
import ms from 'ms';

@ApiTags('Auth')
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

  @ApiOperation({
    summary: 'Register a new user account',
    description:
      'Creates a new user with the default `member` role, hashes the password, issues an access + refresh token pair, and sets both tokens as httpOnly cookies.',
  })
  @ApiBody({ type: RegisterDto, description: 'Registration payload' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully. Tokens set in cookies.',
  })
  @ApiResponse({ status: 409, description: 'Email already registered.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body()
    registerDto: RegisterDto,
  ) {
    const { accessToken, refreshToken, createdUser } =
      await this.authService.register(registerDto);
    this.setAuthCookies(res, accessToken, refreshToken);
    return {
      message: 'User registered successfully',

      user: {
        email: createdUser.email,
        name: createdUser.name,
        roles: createdUser.roles,
      },
      tokens: {
        accessToken: accessToken,
      },
    };
  }

  @ApiOperation({
    summary: 'Log in with email and password',
    description:
      'Validates credentials, issues an access + refresh token pair, and sets both tokens as httpOnly cookies.',
  })
  @ApiBody({ type: LoginDto, description: 'Login payload' })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Tokens set in cookies.',
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body()
    loginDto: LoginDto,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(loginDto);
    this.setAuthCookies(res, accessToken, refreshToken);
    return {
      message: 'User login success.',
      user: {
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
      tokens: {
        accessToken: accessToken,
      },
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
      path: '/',
    };
  }
}
