# H2 — Tasks Admin Controller `findOne` Has No User Scoping

| Field      | Value |
|------------|-------|
| Severity   | **High** |
| Category   | Authorization |
| Files      | `src/modules/tasks/controller/tasks.controller.ts:104-106` |
|            | `src/modules/tasks/services/tasks.service.ts:162-168` |

---

## What's Wrong

The admin tasks controller's `findOne` passes no user context to the service:

```typescript
@Get(':id')
async findOne(@Param('id') id: string) {
  const task = await this.tasksService.findOne(id);  // no req.user.id
  return { message: 'Task retrieved successfully', task };
}
```

The service's `findOne` does no authorization check:
```typescript
async findOne(id: string) {
  const task = await this.taskRepo.findById(id);
  if (!task) throw new NotFoundException('Task not found');
  return this.resolveTaskImageUrls(task);
}
```

---

## Why It Matters

- The admin controller is gated by `@Roles(UserRoles.ADMIN)`, so only admins can hit it.
- If admins are superusers (by design), this is fine but inconsistent with `findByProject` which DOES scope by user.
- If you ever relax the admin gate or add a non-admin route that calls `findOne`, this becomes exploitable immediately.

Unlike C1 (the members controller), this has the admin role guard as a mitigating control — but the inconsistency suggests a bug.

---

## Concrete Fix

If admins should access all tasks:
```typescript
// Document at the class level:
// Admin controller — all endpoints have unrestricted access to all tasks.
```

If admins should be scoped to their projects:
```typescript
async findOne(id: string, userId: string) {
  const task = await this.taskRepo.findById(id);
  if (!task) throw new NotFoundException('Task not found');
  const project = await this.loadProjectWithMembers(task.project.id);
  if (!this.isProjectMember(project, userId)) {
    throw new NotFoundException('Task not found');
  }
  return this.resolveTaskImageUrls(task);
}
```

Either way, make `findOne` consistent with the other methods in the same service.

---

## Verification

Same test as C1 but from the admin controller path.
