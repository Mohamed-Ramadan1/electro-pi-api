# M5 — NotificationsRepo Missing `@Injectable()` Decorator

| Field      | Value |
|------------|-------|
| Severity   | **Medium** |
| Category   | Code Quality / Consistency |
| File       | `src/modules/notifications/repo/notifications.repo.ts:10` |

---

## What's Wrong

The `NotificationsRepo` class does not have the `@Injectable()` decorator:

```typescript
export class NotificationsRepo {  // ← no @Injectable()
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,
  ) {}
```

Every other repository in the codebase has it:
- `UserRepository` — `@Injectable()`
- `NotesRepository` — `@Injectable()`
- `TaskRepository` — `@Injectable()`
- `ProjectRepository` — `@Injectable()`
- `ReminderRepository` — `@Injectable()`

---

## Why It Matters

NestJS's DI container relies on TypeScript's `emitDecoratorMetadata` to resolve constructor parameter types. Without `@Injectable()`, the metadata emission depends entirely on the `@InjectRepository` parameter decorator. While this may work at runtime with the current TypeScript/tsconfig settings, it's fragile:

- If `emitDecoratorMetadata` is disabled, DI breaks silently.
- If the class gains additional dependencies that don't use parameter decorators, injection fails.
- It's inconsistent with every other repo in the project.

---

## Concrete Fix

Add the decorator:

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsRepo {
```

---

## Verification

The app should continue to work. No behavioral change — this is a consistency and robustness fix.
