# C3 — Deactivated Users Can Still Log In

| Field      | Value |
|------------|-------|
| Severity   | **Critical** |
| Category   | Security / Auth |
| Files      | `src/modules/users/repository/user.repo.ts:17-27` |
|            | `src/modules/auth/services/auth.service.ts:51-77` |

---

## What's Wrong

The `login` flow never checks whether the user is active. A deactivated user (admin clicked "deactivate") can still authenticate and receive fresh access + refresh tokens.

**The query** (`user.repo.ts:17-27`):
```typescript
findByEmailWithPassword(email: string): Promise<User | null> {
  return this.repo.findOne({
    where: { email },              // ← no isActive: true
    select: {
      id: true, email: true, name: true, roles: true, passwordHash: true,
    },
  });
}
```

**The login method** (`auth.service.ts:51-77`):
```typescript
async login(loginDto: LoginDto) {
  const user = await this.userService.findByEmailWithPassword(loginDto.email);
  if (!user) {
    throw new UnauthorizedException('Invalid email or password.');
  }
  // ← no isActive check here either
  const isPasswordValid = await this.passwordService.verify(...);
  ...
  const { accessToken, refreshToken } = await this.issueTokens(user.id, user.roles);
  return { accessToken, refreshToken, user };
}
```

---

## Why It Matters

The entire purpose of "deactivate user" is to block access. Right now, deactivation only sets a flag in the database — it has zero effect on authentication. A disgruntled ex-employee whose account was "deactivated" can still log in with their old credentials.

---

## Concrete Fix

**Option A — Filter at query level (recommended):**
```typescript
findByEmailWithPassword(email: string): Promise<User | null> {
  return this.repo.findOne({
    where: { email, isActive: true },  // ← added
    select: { id: true, email: true, name: true, roles: true, passwordHash: true },
  });
}
```
The user simply won't be found. `null` → thrown as "invalid email or password." No code changes needed elsewhere.

**Option B — Explicit check in login (if you want audit logging):**
```typescript
if (!user || !user.isActive) {
  throw new UnauthorizedException('Invalid email or password.');
}
```
Requires adding `isActive: true` to the `select` array in the repo query.

---

## Verification

1. Create a user, log in → succeeds.
2. Deactivate the user (PATCH `/users/:id/deactivate`).
3. Attempt login again → must return 401.
