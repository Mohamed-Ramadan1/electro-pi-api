# C2 — Unawaited Promise in Notes activate/deactivate

| Field      | Value |
|------------|-------|
| Severity   | **Critical** |
| Category   | Correctness / Data Integrity |
| File       | `src/modules/notes/repo/notes.repo.ts:56,64` |

---

## What's Wrong

The `activate` and `deactivate` methods fire an `UPDATE` query without `await`, then immediately read from the database. The read may complete before the write does, returning stale data.

```typescript
// notes.repo.ts:55-62
async activate(id: string, userId: string): Promise<Notes> {
  this.repo.update({ id, user: { id: userId } }, { isActive: true }); // ← NOT AWAITED
  const note = await this.repo.findOneByOrFail({
    id,
    user: { id: userId },
  });
  return note; // may still have isActive: false
}
```

Same bug in `deactivate` on line 64:
```typescript
async deactivate(id: string, userId: string): Promise<Notes> {
  this.repo.update({ id, user: { id: userId } }, { isActive: false }); // ← NOT AWAITED
  ...
}
```

---

## Why It Matters

- The controller returns 200 OK but the returned note may have `isActive` unchanged.
- The frontend toggles the note's visibility based on `isActive` — it will appear to "not work" (click activate → note still shows as inactive → UI hides it).
- If the `update` Promise rejects (e.g., DB connection drops mid-query), the error is silently swallowed (unhandled promise rejection). The method still returns "success."
- This is a **one-character fix** with potential for real user-facing data corruption.

---

## Concrete Fix

Add `await` before each `update` call:

```typescript
async activate(id: string, userId: string): Promise<Notes> {
  await this.repo.update({ id, user: { id: userId } }, { isActive: true });
  const note = await this.repo.findOneByOrFail({ id, user: { id: userId } });
  return note;
}

async deactivate(id: string, userId: string): Promise<Notes> {
  await this.repo.update({ id, user: { id: userId } }, { isActive: false });
  const note = await this.repo.findOneByOrFail({ id, user: { id: userId } });
  return note;
}
```

---

## Verification

After fix, call activate → response has `isActive: true`. Call deactivate → response has `isActive: false`. The update and read are now sequenced correctly.
