# C4 — Auth Guard Masks All Errors as "Invalid or Expired Token"

| Field      | Value |
|------------|-------|
| Severity   | **Critical** |
| Category   | Error Handling / Operability |
| File       | `src/common/guards/auth.guard.ts:47-49` |

---

## What's Wrong

The `catch` block in the auth guard catches **every** exception type and re-throws them all as `UnauthorizedException('Invalid or expired token')`. This includes:

- DB connection failures (TypeORM errors)
- Network timeouts
- Configuration errors
- Memory exhaustion
- Bugs in user lookup

```typescript
try {
  const payload = await this.tokenService.verifyAccessToken(token);
  const user = await this.userService.findById(payload.sub);
  if (!user) throw new UnauthorizedException('User not found');
  req['user'] = user;
} catch (error) {
  throw new UnauthorizedException('Invalid or expired token'); // ← EVERYTHING
}
```

---

## Why It Matters

- **Monitoring is blind:** A DB outage causes every user to see "invalid token." Your alerting can't distinguish between "someone is sending bad tokens" (normal noise) and "the database is down" (P1 incident).
- **Debugging is impossible:** The real error (e.g., `ECONNREFUSED 127.0.0.1:5432`) is swallowed. Logs show only "invalid token" with no root cause.
- **On-call engineers will waste time** chasing a phantom auth problem while the actual issue (DB failure, config misload) goes undetected.

---

## Concrete Fix

Narrow the catch to only JWT-specific errors. Let infrastructure errors propagate:

```typescript
try {
  const payload = await this.tokenService.verifyAccessToken(token);
  const user = await this.userService.findById(payload.sub);
  if (!user) {
    throw new UnauthorizedException('User not found');
  }
  req['user'] = user;
} catch (error) {
  if (error instanceof UnauthorizedException) {
    throw error; // re-throw our own auth errors as-is
  }
  if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
    throw new UnauthorizedException('Invalid or expired token');
  }
  // Everything else (DB errors, network failures, etc.):
  throw error; // let the global exception filter turn it into a 500
}
```

Requires importing:
```typescript
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
```

---

## Verification

1. With DB running: expired token → 401 "Invalid or expired token."
2. With DB stopped: any valid token → 500 "Internal server error" (not 401).
3. Check logs: the 500 case logs the real `ConnectionError`, not a generic "invalid token."
