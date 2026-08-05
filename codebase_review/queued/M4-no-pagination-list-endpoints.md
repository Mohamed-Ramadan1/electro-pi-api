# M4 — No Pagination on List Endpoints

| Field    | Value                                       |
| -------- | ------------------------------------------- |
| Severity | **Medium**                                  |
| Category | Architecture / Scalability                  |
| Files    | All `findAll`/`get*` methods across modules |

---

## What's Wrong

Every list endpoint returns unlimited results:

```typescript
// reminders.repo.ts
findAll(userId: string): Promise<Reminder[]> {
  return this.reminderRepo.find({ where: { user: { id: userId } } });
}

// notes.repo.ts
async findAll(userId: string): Promise<Notes[]> {
  const notes = this.repo.find({ where: { user: { id: userId } } });
  return notes;
}

// notifications.repo.ts
findAll(userid: string): Promise<Notifications[]> {
  return this.notificationsRepository.find({ where: { user: { id: userid } } });
}
```

No `skip`, `take`, `limit`, `offset`, or cursor parameters exist anywhere.

---

## Why It Matters

- A user with 50,000 notes will receive all 50,000 in a single response — memory pressure on both server and client.
- The response time grows linearly with data volume.
- No mechanism for the frontend to implement "load more" or infinite scroll.

---

## Concrete Fix

Add `PaginationDto`:

```typescript
export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  take?: number = 20;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip?: number = 0;
}
```

Update repos:

```typescript
findAll(userId: string, pagination?: PaginationDto): Promise<Reminder[]> {
  return this.reminderRepo.find({
    where: { user: { id: userId } },
    take: pagination?.take ?? 20,
    skip: pagination?.skip ?? 0,
    order: { createdAt: 'DESC' },
  });
}
```

Add `@Query() pagination: PaginationDto` to list endpoints.

---

## Verification

Request `GET /notes?take=5&skip=10` → returns exactly 5 notes, starting from the 11th.
