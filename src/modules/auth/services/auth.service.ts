import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { UserService } from '@modules/users/services/user.service';
import { LoginDto, RegisterDto } from '../dto/index';
import { PasswordService, TokenService } from '@infrastructure/index';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto) {
    if (await this.userService.userExists(registerDto.email)) {
      throw new ConflictException('User with this email already exists.');
    }

    const passwordHash = await this.passwordService.hash(registerDto.password);
    try {
      const createdUser = await this.userService.create({
        name: registerDto.name,
        email: registerDto.email,
        passwordHash,
      });

      return await this.issueTokens(createdUser.id, createdUser.roles);
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ConflictException('User with this email already exists.');
      }
      throw err;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmailWithPassword(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await this.passwordService.verify(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return await this.issueTokens(user.id, user.roles);
  }

  // Helper reusable methods.

  private async issueTokens(userId: string, roles: string[]) {
    const { accessToken, refreshToken } =
      await this.tokenService.issueTokenPair({
        sub: userId,
        roles: roles,
        jti: randomUUID(),
      });

    return {
      accessToken,
      refreshToken,
    };
  }
}
