import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { createMock } from '../../../../test/helpers/mock-factory';
import { PasswordService } from '@infrastructure/password/services/password.service';
import { TokenService } from '@infrastructure/jwt/services/token.service';
import { UserService } from '@modules/users/services/user.service';
import { buildUser } from '../../../../test/factories/user.factory';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let passwordService: jest.Mocked<PasswordService>;
  let tokenService: jest.Mocked<TokenService>;

  beforeEach(async () => {
    userService = createMock<UserService>({
      userExists: jest.fn().mockResolvedValue(false),
      findByEmailWithPassword: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(buildUser()),
    });

    passwordService = createMock<PasswordService>({
      hash: jest.fn().mockResolvedValue('$2b$10$hashed'),
      verify: jest.fn().mockResolvedValue(true),
    });

    tokenService = createMock<TokenService>({
      issueTokenPair: jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 900,
      }),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: PasswordService, useValue: passwordService },
        { provide: TokenService, useValue: tokenService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    const dto = {
      name: 'New User',
      email: 'new@test.com',
      password: 'Str0ng!Pass',
    };

    it('should hash password and create a user', async () => {
      await service.register(dto);

      expect(passwordService.hash).toHaveBeenCalledWith('Str0ng!Pass');
      expect(userService.create).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@test.com',
        passwordHash: '$2b$10$hashed',
      });
    });

    it('should issue tokens for the created user', async () => {
      const user = buildUser({ id: 'user-id-123', roles: ['member'] as any });
      userService.create.mockResolvedValue(user);

      const result = await service.register(dto);

      expect(tokenService.issueTokenPair).toHaveBeenCalledWith(
        expect.objectContaining({ sub: 'user-id-123', roles: ['member'] }),
      );
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
    });

    it('should throw ConflictException if user exists', async () => {
      userService.userExists.mockResolvedValue(true);

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException on duplicate email (code 23505)', async () => {
      userService.create.mockRejectedValue({ code: '23505' });

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const dto = { email: 'test@test.com', password: 'Str0ng!Pass' };

    it('should throw UnauthorizedException if user not found', async () => {
      userService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const user = buildUser({ passwordHash: '$2b$10$hashed' });
      userService.findByEmailWithPassword.mockResolvedValue(user);
      passwordService.verify.mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens on successful login', async () => {
      const user = buildUser({
        id: 'user-id-123',
        email: 'test@test.com',
      });
      userService.findByEmailWithPassword.mockResolvedValue(user);

      const result = await service.login(dto);

      expect(passwordService.verify).toHaveBeenCalledWith(
        'Str0ng!Pass',
        user.passwordHash,
      );
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.user).toBe(user);
    });
  });
});
