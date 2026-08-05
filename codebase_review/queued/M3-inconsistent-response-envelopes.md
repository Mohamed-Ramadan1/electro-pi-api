# M3 — Inconsistent Response Envelopes Across Modules

| Field      | Value |
|------------|-------|
| Severity   | **Medium** |
| Category   | Architecture / Consistency |
| Files      | All controllers |

---

## What's Wrong

Each module returns data under a different key in the response body:

| Module         | Data Key       | Example                          |
|----------------|----------------|----------------------------------|
| Notes          | `data`         | `{ message: "...", data: note }` |
| Reminders      | `reminders`    | `{ message: "...", reminders }`  |
| Tasks          | `task`/`tasks` | `{ message: "...", task }`       |
| Projects       | `project`      | `{ message: "...", project }`    |
| Users          | `user`/`users` | `{ message: "...", users }`      |
| Notifications  | `notifications`/`count` | `{ message: "...", count }` |
| Auth           | `user`         | `{ message: "...", user: {...} }`|

The `TransformResponseInterceptor` wraps every response with `{ message, ...data }`, so there's a partial common envelope (the `message` field), but the data key is module-specific.

---

## Why It Matters

- Frontend consumers need per-module logic to extract the data: `res.data` for notes, `res.reminders` for reminders, `res.task` for tasks.
- Adding a new module requires the frontend team to check "what key does this one use?"
- Any future SDK generation or API gateway routing becomes harder.

---

## Concrete Fix

Standardize on a single envelope:

```typescript
// Global response type
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

Then normalize all controllers:
```typescript
return {
  message: 'Notes retrieved successfully.',
  data: notes,  // ← always 'data'
};
```

Or use a shared utility:
```typescript
function ok<T>(message: string, data: T): ApiResponse<T> {
  return { success: true, message, data };
}
```

---

## Verification

All endpoints consistently return `{ success: true, message: "...", data: ... }`.
