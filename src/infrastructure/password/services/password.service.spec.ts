import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$10$hashedvalue'),
  compare: jest.fn().mockResolvedValue(true),
}));

import * as bcrypt from 'bcrypt';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
    jest.clearAllMocks();
  });

  describe('hash', () => {
    it('should hash a plaintext password', async () => {
      const result = await service.hash('my-password');

      expect(bcrypt.hash).toHaveBeenCalledWith('my-password', 10);
      expect(result).toBe('$2b$10$hashedvalue');
    });
  });

  describe('verify', () => {
    it('should return true when password matches hash', async () => {
      const result = await service.verify('my-password', '$2b$10$hashedvalue');

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'my-password',
        '$2b$10$hashedvalue',
      );
      expect(result).toBe(true);
    });

    it('should return false when password does not match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await service.verify('wrong', '$2b$10$hashedvalue');

      expect(result).toBe(false);
    });
  });
});
