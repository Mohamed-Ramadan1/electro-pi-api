/**
 * Default cost factor for bcrypt password hashing.
 * 10 rounds = ~10 hashes/sec on modern hardware.
 * Increase to 12 for sensitive applications (at the cost of slower auth).
 */
export const BCRYPT_SALT_ROUNDS = 10;
