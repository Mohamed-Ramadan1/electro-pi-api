# L5 — `UpdateTaskStatusDto.status` Typed as `string` Instead of `TasksStatus`

| Field      | Value |
|------------|-------|
| Severity   | **Low** |
| Category   | Type Safety |
| Files      | `src/modules/tasks/dto/update-task-status.dto.ts:12` |
|            | `src/modules/tasks/services/tasks.service.ts:312,259-265` |

---

## What's Wrong

The DTO field is typed as `string` even though it's validated against the enum:

```typescript
export class UpdateTaskStatusDto {
  @IsEnum(tasksStatus)
  @IsNotEmpty()
  status!: string;  // ← should be TasksStatus
}
```

This forces `as any` casts in the service:
```typescript
// tasks.service.ts
task.status = dto.status as any;  // ← cast needed because dto.status is string
```

The same pattern exists for `UpdateTaskDto.priority` and `UpdateTaskDto.status` — both are typed as `string` but validated against enums.

---

## Why It Matters

- The `as any` cast disables type checking for the assignment.
- If the enum type changes (e.g., new values added), the DTO will still accept the new value via validation but the TypeScript compiler won't catch mismatches.
- The DTO's TypeScript type and its runtime validation are inconsistent.

---

## Concrete Fix

Import and use the proper type:

```typescript
import { TasksStatus } from '../constants/taskst.const';

export class UpdateTaskStatusDto {
  @IsEnum(tasksStatus)
  @IsNotEmpty()
  status!: TasksStatus;  // ← typed correctly
}
```

Then remove the `as any` casts in the service.

Do the same for `UpdateTaskDto.status` and `UpdateTaskDto.priority` — both should use `TasksStatus` and `TasksPriority` respectively.

---

## Verification

TypeScript compilation passes without `as any` casts on status/priority assignments.
