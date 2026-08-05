# L1 — Inconsistent Repository Naming

| Field    | Value                                                                      |
| -------- | -------------------------------------------------------------------------- |
| Severity | **Low**                                                                    |
| Category | Code Quality / Consistency                                                 |
| Files    | `src/modules/notifications/repo/notifications.repo.ts` vs. all other repos |

---

## What's Wrong

The notifications repository uses the abbreviated `Repo` suffix while every other repository uses `Repository`:

| Module            | Class Name                             |
| ----------------- | -------------------------------------- |
| Users             | `UserRepository`                       |
| Notes             | `NotesRepository`                      |
| Tasks             | `TaskRepository`                       |
| Projects          | `ProjectRepository`                    |
| Reminders         | `ReminderRepository`                   |
| **Notifications** | **`NotificationsRepo`** ← inconsistent |

---

## Concrete Fix

Rename to `NotificationsRepository`:

```typescript
@Injectable()
export class NotificationsRepository {
```

Update the import in `notifications.service.ts` and the provider in `notifications.module.ts`.

---

## Verification

Grep for `NotificationsRepo` — no references should remain after rename.
