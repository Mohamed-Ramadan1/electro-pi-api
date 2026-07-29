import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../constants/password.constants';

/**
 * Infrastructure service for password hashing and verification.
 *
 * This is a pure cryptographic utility — it has no domain knowledge
 * of users, auth, or business rules. It takes a string, returns a hash.
 *
 * Swapping the algorithm (e.g. bcrypt → argon2) requires changing
 * only this file and the dependency in package.json.
 */
@Injectable()
export class PasswordService {
  /**
   * Hash a plaintext password.
   * @returns The bcrypt hash string (includes salt and algorithm metadata).
   */
  async hash(plain: string): Promise<string> {
    return hash(plain, BCRYPT_SALT_ROUNDS);
  }

  /**
   * Verify a plaintext password against a stored hash.
   * Uses constant-time comparison (built into bcrypt.compare).
   */
  async verify(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed);
  }
}
