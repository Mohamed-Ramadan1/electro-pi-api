# H5 — `reminderAt` Type Mismatch (String DTO → Date Entity)

| Field      | Value |
|------------|-------|
| Severity   | **High** |
| Category   | Correctness / Data Integrity |
| Files      | `src/modules/reminders/repo/reminders.repo.ts:17-21,29-34` |
|            | `src/modules/reminders/entity/reminder.entity.ts:27` |

---

## What's Wrong

The DTO declares `reminderAt` as `string` (validated with `@IsDateString`), but the entity column is `timestamptz` / TypeScript `Date`. The repo spreads the DTO directly into `create()` and `merge()`:

**Create** (`reminders.repo.ts:17-21`):
```typescript
create(userId: string, reminderData: CreateReminderDto): Promise<Reminder> {
  const reminder = this.reminderRepo.create({
    ...reminderData,   // ← reminderAt is string here
    user: { id: userId },
  });
  return this.reminderRepo.save(reminder);
}
```

**Update** (`reminders.repo.ts:29-34`):
```typescript
async update(userId: string, reminderId: string, updateData: UpdateReminderDto) {
  const reminder = await this.reminderRepo.findOneByOrFail({...});
  this.reminderRepo.merge(reminder, updateData);  // ← merges string into Date field
  return this.reminderRepo.save(reminder);
}
```

**Entity** (`reminder.entity.ts:27`):
```typescript
@Column({ type: 'timestamptz', nullable: false })
reminderAt!: Date;  // ← expects Date, gets string
```

---

## Why It Matters

TypeORM's behavior when assigning a string to a `timestamptz` column is driver-version-dependent:
- It might silently coerce (works today, breaks tomorrow).
- It might drop the value (saved as NULL or epoch 0).
- It might throw at runtime.

The `reminderAt` field is non-nullable — if coercion fails, the save will succeed with a wrong date, or fail with an obscure Postgres error. Either way: silent data corruption or a confusing 500.

---

## Concrete Fix

Explicitly convert the string to `Date` before saving:

```typescript
create(userId: string, reminderData: CreateReminderDto): Promise<Reminder> {
  const reminder = this.reminderRepo.create({
    title: reminderData.title,
    reminderMessage: reminderData.reminderMessage,
    reminderAt: new Date(reminderData.reminderAt),  // ← explicit conversion
    repeatCount: reminderData.repeatCount,
    snoozeMinutes: reminderData.snoozeMinutes,
    repeatInterval: reminderData.repeatInterval,
    user: { id: userId },
  });
  return this.reminderRepo.save(reminder);
}
```

For update, convert before merge:
```typescript
async update(userId: string, reminderId: string, updateData: UpdateReminderDto) {
  const reminder = await this.reminderRepo.findOneByOrFail({...});
  const data = {
    ...updateData,
    ...(updateData.reminderAt && { reminderAt: new Date(updateData.reminderAt) }),
  };
  this.reminderRepo.merge(reminder, data);
  return this.reminderRepo.save(reminder);
}
```

---

## Verification

- Create a reminder with `reminderAt: "2026-08-06T10:00:00.000Z"`.
- Fetch it back — `reminderAt` should be a valid ISO timestamp, not NULL and not epoch.
