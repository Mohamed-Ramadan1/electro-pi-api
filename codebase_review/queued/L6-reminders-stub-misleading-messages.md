# L6 — Reminders Stub Methods Have Misleading Response Messages

| Field    | Value                                                              |
| -------- | ------------------------------------------------------------------ |
| Severity | **Low**                                                            |
| Category | Code Quality                                                       |
| File     | `src/modules/reminders/controller/reminders.controller.ts:161-202` |

---

## What's Wrong

Five unimplemented stub methods return a hardcoded message that doesn't match the operation:

```typescript
@Patch(':id/reschedule')
rescheduleReminder() {
  this.reminderService.rescheduleReminder();
  return { message: 'Reminders retrieved successfully.' };  // ← wrong message
}

@Patch(':id/toggle')
toggleReminder() {
  this.reminderService.toggleReminder();
  return { message: 'Reminders retrieved successfully.' };  // ← wrong message
}

// Same for snooze, upcoming, acknowledge — all return "Reminders retrieved successfully."
```

---

## Why It Matters

- If any of these stubs are accidentally called in production, the client receives "Reminders retrieved successfully" with no data — but no actual work was done.
- The misleading message hides the fact that these are no-ops.
- Low priority because these are clearly unfinished (empty service methods, no Swagger docs), but still worth noting.

---

## Concrete Fix

Since these are explicitly out of scope until implemented, either:

1. Make them throw a clear error:

   ```typescript
   rescheduleReminder() {
     throw new NotImplementedException('Reschedule is not yet implemented.');
   }
   ```

2. Return a truthful placeholder:
   ```typescript
   rescheduleReminder() {
     return { message: 'Not yet implemented.' };
   }
   ```

Implement `NotImplementedException`:

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

export class NotImplementedException extends HttpException {
  constructor(message = 'Not implemented') {
    super(message, HttpStatus.NOT_IMPLEMENTED); // 501
  }
}
```

---

## Verification

Calling any of the 5 stub endpoints returns 501 with a clear message, not 200 with fake success.
