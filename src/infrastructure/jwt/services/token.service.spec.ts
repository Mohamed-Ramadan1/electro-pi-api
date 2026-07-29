import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { JWT_CONFIG } from '../constants/jwt.constants';

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
  verifyAsync: jest.fn().mockResolvedValue({
    sub: 'user-1',
    type: 'access',
    iat: 1234567890,
    exp: 1234567890,
  }),
  decode: jest.fn().mockReturnValue({ sub: 'user-1' }),
};

const mockJwtConfig = {
  accessSecret: 'test-access-secret',
  refreshSecret: 'test-refresh-secret',
  accessTtl: '15m' as const,
  refreshTtl: '7d' as const,
  issuer: 'test-issuer',
  audience: 'test-audience',
};

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: JWT_CONFIG, useValue: mockJwtConfig },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jest.clearAllMocks();
  });

  describe('issueAccessToken', () => {
    it('should sign and return an access token', async () => {
      const token = await service.issueAccessToken({
        sub: 'user-1',
        roles: ['member'],
      });

      expect(token).toBe('mock-jwt-token');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { sub: 'user-1', roles: ['member'], type: 'access' },
        {
          audience: 'test-audience',
          expiresIn: '15m',
          issuer: 'test-issuer',
          secret: 'test-access-secret',
        },
      );
    });
  });

  describe('issueRefreshToken', () => {
    it('should sign and return a refresh token', async () => {
      const token = await service.issueRefreshToken({
        sub: 'user-1',
        jti: 'test-jti',
        roles: ['member'],
      });

      expect(token).toBe('mock-jwt-token');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { sub: 'user-1', jti: 'test-jti', roles: ['member'], type: 'refresh' },
        {
          audience: 'test-audience',
          expiresIn: '7d',
          issuer: 'test-issuer',
          secret: 'test-refresh-secret',
        },
      );
    });
  });

  describe('issueTokenPair', () => {
    it('should return both tokens and expiry', async () => {
      const pair = await service.issueTokenPair({
        sub: 'user-1',
        roles: ['member'],
      });

      expect(pair.accessToken).toBe('mock-jwt-token');
      expect(pair.refreshToken).toBe('mock-jwt-token');
      expect(pair.expiresIn).toBe(900);
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and return payload for valid access token', async () => {
      const payload = await service.verifyAccessToken('valid-token');

      expect(payload.sub).toBe('user-1');
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
        audience: 'test-audience',
        issuer: 'test-issuer',
        secret: 'test-access-secret',
      });
    });

    it('should throw if token type is not access', async () => {
      mockJwtService.verifyAsync.mockResolvedValueOnce({
        sub: 'user-1',
        type: 'refresh',
      });

      await expect(service.verifyAccessToken('bad-token')).rejects.toThrow(
        'Invalid access token type',
      );
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify and return payload for valid refresh token', async () => {
      mockJwtService.verifyAsync.mockResolvedValueOnce({
        sub: 'user-1',
        type: 'refresh',
      });

      const payload = await service.verifyRefreshToken('valid-token');

      expect(payload.sub).toBe('user-1');
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
        audience: 'test-audience',
        issuer: 'test-issuer',
        secret: 'test-refresh-secret',
      });
    });

    it('should throw if token type is not refresh', async () => {
      await expect(service.verifyRefreshToken('bad-token')).rejects.toThrow(
        'Invalid refresh token type',
      );
    });
  });

  describe('decode', () => {
    it('should decode a token', () => {
      const result = service.decode('token');
      expect(result).toEqual({ sub: 'user-1' });
      expect(mockJwtService.decode).toHaveBeenCalledWith('token');
    });
  });

  describe('getAccessExpiresInSeconds', () => {
    it('should return 900 for 15m', () => {
      expect(service.getAccessExpiresInSeconds()).toBe(900);
    });

    it('should return numeric value when config uses number', async () => {
      const numModule: TestingModule = await Test.createTestingModule({
        providers: [
          TokenService,
          { provide: JwtService, useValue: mockJwtService },
          { provide: JWT_CONFIG, useValue: { ...mockJwtConfig, accessTtl: 3600 } },
        ],
      }).compile();

      const numService = numModule.get<TokenService>(TokenService);
      expect(numService.getAccessExpiresInSeconds()).toBe(3600);
    });
  });
});
