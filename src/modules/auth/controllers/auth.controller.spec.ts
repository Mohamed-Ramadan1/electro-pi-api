import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { createMock } from '../../../../test/helpers/mock-factory';
import { Response } from 'express';
import { buildUser } from '../../../../test/factories/user.factory';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockResponse = {
    cookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    authService = createMock<AuthService>({
      register: jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        createdUser: buildUser({
          id: 'new-user-id',
          email: 'new@test.com',
          name: 'New User',
          roles: ['member'] as any,
        }),
      }),
      login: jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: buildUser({
          id: 'user-1',
          email: 'test@test.com',
          name: 'Test User',
          roles: ['member'] as any,
        }),
      }),
    });

    const mockConfigService = createMock<ConfigService>({
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'JWT_ACCESS_TTL') return '15m';
        if (key === 'JWT_REFRESH_TTL') return '7d';
        if (key === 'NODE_ENV') return 'test';
        return null;
      }),
    });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    const dto = {
      name: 'New User',
      email: 'new@test.com',
      password: 'Str0ng!Pass',
    };

    it('should register a user and set cookies', async () => {
      const result = await controller.register(mockResponse, dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(result.message).toBe('User registered successfully');
      expect(result.tokens.accessToken).toBe('access-token');
    });
  });

  describe('POST /login', () => {
    const dto = { email: 'test@test.com', password: 'Str0ng!Pass' };

    it('should login and set cookies', async () => {
      const result = await controller.login(mockResponse, dto);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(result.message).toBe('User login success.');
      expect(result.tokens.accessToken).toBe('access-token');
    });
  });
});
