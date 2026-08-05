# M8 — Auth Service Catches Duplicate-Key Error with Raw `any`

| Field      | Value |
|------------|-------|
| Severity   | **Medium** |
| Category   | Code Quality / Type Safety |
| File       | `src/modules/auth/services/auth.service.ts:43` |

---

## What's Wrong

The `register` method catches the Postgres unique violation as a fallback to the email existence check:

```typescript
try {
  const createdUser = await this.userService.create({...});
  ...
} catch (err: any) {              // ← loose 'any'
  if (err.code === '23505') {     // ← Postgres-specific error code
    throw new ConflictException('User with this email already exists.');
  }
  throw err;
}
```

---

## Why It Matters

- `err: any` defeats TypeScript's type system. Accessing `err.code` has zero type safety.
- `'23505'` is a Postgres-specific error code. If the database driver changes (e.g., MySQL, SQLite for testing), this check silently breaks.
- The `userExists()` pre-check on line 22 already handles this case. The `catch` is a race-condition guard — between the `userExists()` check and the `insert`, another request could create the same email. But the `userExists()` check makes this catch redundant in most cases.
- Race conditions are better handled with a unique constraint at the DB level and a proper error type.

---

## Concrete Fix

Use TypeORM's `QueryFailedError` type:

```typescript
import { QueryFailedError } from 'typeorm';

try {
  const createdUser = await this.userService.create({...});
  ...
} catch (err) {
  if (err instanceof QueryFailedError && (err as any).code === '23505') {
    throw new ConflictException('User with this email already exists.');
  }
  throw err;
}
```

Or extract the error-code logic into a utility:
```typescript
function isUniqueViolation(err: unknown): boolean {
  return err instanceof QueryFailedError && (err as QueryFailedError & { code: string }).code === '23505';
}
```

---

## Verification

Two concurrent register requests with the same email — only one succeeds, the other gets 409 Conflict.
