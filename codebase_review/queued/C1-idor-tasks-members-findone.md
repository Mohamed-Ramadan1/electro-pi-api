# C1 — IDOR: Any Authenticated Member Can Read Any Task by ID

| Field      | Value |
|------------|-------|
| Severity   | **Critical** |
| Category   | Security / Authorization |
| Files      | `src/modules/tasks/controller/tasks-members.controller.ts:79-82` |
|            | `src/modules/tasks/services/tasks.service.ts:162-168` |
|            | `src/modules/tasks/repo/task.repo.ts:37-47` |

---

## What's Wrong

The members controller's `findOne` endpoint does zero user scoping. Any authenticated member can supply any task UUID and read its full details — including tasks from projects they do not belong to.

**Controller** (`tasks-members.controller.ts:79-82`):
```typescript
@Get(':id')
async findOne(@Param('id') id: string) {
  const task = await this.tasksService.findOne(id);  // no user ID passed
  return { message: 'Task retrieved successfully', task };
}
```

**Service** (`tasks.service.ts:162-168`):
```typescript
async findOne(id: string) {
  const task = await this.taskRepo.findById(id);  // no ownership filter
  if (!task) {
    throw new NotFoundException('Task not found');
  }
  return this.resolveTaskImageUrls(task);
}
```

**Repo** (`task.repo.ts:37-47`):
```typescript
findById(id: string): Promise<Task | null> {
  return this.repo.findOne({
    where: { id },  // ← no user/project scoping whatsoever
    relations: { creator: true, assignee: true, project: true, images: true },
  });
}
```

---

## Why It Matters

This is a direct object reference vulnerability. A user from Project A can guess (or enumerate) task UUIDs from Project B and read task titles, descriptions, assignees, due dates, and attached images. This bypasses the entire project-boundary authorization model.

---

## Concrete Fix

Add project-membership verification to the service's `findOne` method, matching the pattern already used by `findByProject` and `updateTask`.

```typescript
// tasks.service.ts
async findOne(id: string, userId?: string) {
  const task = await this.taskRepo.findById(id);
  if (!task) {
    throw new NotFoundException('Task not found');
  }

  if (userId) {
    const project = await this.loadProjectWithMembers(task.project.id);
    if (!this.isProjectMember(project, userId)) {
      throw new NotFoundException('Task not found'); // don't leak existence
    }
  }

  return this.resolveTaskImageUrls(task);
}
```

Then update the members controller:
```typescript
@Get(':id')
async findOne(@Param('id') id: string, @Req() req: Request) {
  const task = await this.tasksService.findOne(id, req.user.id);
  return { message: 'Task retrieved successfully', task };
}
```

---

## Verification

After fix, a member from Project A should get 404 when requesting a task UUID that exists in Project B but where they are not a member.
