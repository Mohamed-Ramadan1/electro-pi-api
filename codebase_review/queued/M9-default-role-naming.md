# M9 — `DEFAULT_ROLE` Used as Default Value, Not a Role Definition

| Field      | Value |
|------------|-------|
| Severity   | **Medium** |
| Category   | Code Quality / Naming |
| File       | `src/common/constants/roles.constants.ts:8` |

---

## What's Wrong

The naming convention conflates "default value" with the role definition:

```typescript
export const UserRoles = {
  MEMBER: 'member',
  ADMIN: 'admin',
} as const;

export const DEFAULT_ROLE = UserRoles.MEMBER;
```

`DEFAULT_ROLE` is a *value* (`'member'`), not a *role type*. But the name reads like it's a standalone role — which is confusing when used alongside `UserRole`:

```typescript
import { UserRole, DEFAULT_ROLE } from '@common/index';

async createWithRoles(name: string, email: string, password: string, roles?: UserRole[]): Promise<User> {
  const assignedRoles = roles?.length ? roles : [DEFAULT_ROLE];  // ← DEFAULT_ROLE is 'member', used as a role
```

---

## Why It Matters

If someone reads `DEFAULT_ROLE` and thinks it's a new role type (like `UserRole.MEMBER`), they might try to compare it:
```typescript
if (user.roles.includes(DEFAULT_ROLE)) { ... }  // works by accident, but semantically wrong
```

The correct usage is:
```typescript
if (user.roles.includes(UserRoles.MEMBER)) { ... }
```

---

## Concrete Fix

Rename to `DEFAULT_USER_ROLE` or `FALLBACK_ROLE` to clarify it's a default value:

```typescript
export const DEFAULT_USER_ROLE = UserRoles.MEMBER;
```

Or use `UserRoles.MEMBER` directly where the default is needed (only one usage site — `user.service.ts:28`).

---

## Verification

No behavioral change. Just a rename — wherever `DEFAULT_ROLE` is imported, update to `DEFAULT_USER_ROLE`.
