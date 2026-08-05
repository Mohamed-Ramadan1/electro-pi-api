# H3 — No Effective Rate Limiting on Auth Endpoints

| Field      | Value |
|------------|-------|
| Severity   | **High** |
| Category   | Security / Abuse Prevention |
| File       | `src/core/core.module.ts:14-30` |

---

## What's Wrong

Three Throttler tiers are defined, but only the `default` tier is ever used:

```typescript
ThrottlerModule.forRoot([
  { name: 'default', ttl: 60000, limit: 250 },  // ← all routes use this
  { name: 'strict',   ttl: 60000, limit: 250 },  // ← never applied
  { name: 'auth',     ttl: 900000, limit: 35 },  // ← never applied
])
```

No endpoint in the codebase uses `@Throttle()` or `@SkipThrottle()` decorators. Every route — including login and register — falls through to the `default` tier: **250 requests per minute**.

---

## Why It Matters

- Login and register endpoints have no effective rate limiting. An attacker can brute-force credentials or enumerate emails at 250 req/min (over 4 req/sec).
- The `auth` tier (35 requests per **15 minutes**) was clearly intended for these endpoints but was never wired up.
- The `strict` tier has the same limit as `default` (250/60s), making it redundant — suggests it was copy-pasted and not tuned.

---

## Concrete Fix

Apply the `auth` throttle to login and register:

```typescript
// auth.controller.ts
import { Throttle } from '@nestjs/throttler';

@Post('register')
@Throttle({ auth: { limit: 5, ttl: 900000 } })  // 5 attempts per 15 min
@HttpCode(HttpStatus.CREATED)
async register(...) { ... }

@Post('login')
@Throttle({ auth: { limit: 5, ttl: 900000 } })  // 5 attempts per 15 min
@HttpCode(HttpStatus.OK)
async login(...) { ... }
```

Optionally tune the tiers:
```typescript
{ name: 'strict', ttl: 60000, limit: 30 },   // sensitive ops: 30/min
{ name: 'default', ttl: 60000, limit: 120 },  // general: 120/min
{ name: 'auth',    ttl: 900000, limit: 5 },   // login/register: 5/15min
```

---

## Verification

Send 6 login attempts within 15 minutes → the 6th should return 429 Too Many Requests.
