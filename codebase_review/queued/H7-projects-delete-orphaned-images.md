# H7 — Projects Delete Doesn't Clean Up S3 Images

| Field      | Value |
|------------|-------|
| Severity   | **High** |
| Category   | Resource Leak / Storage |
| File       | `src/modules/projects/services/projects.service.ts:90-96` |

---

## What's Wrong

`deleteProject` removes the database row but never deletes the uploaded project cover image from S3/local storage:

```typescript
async deleteProject(id: string) {
  const project = await this.projectRepo.findById(id);
  if (!project) {
    throw new NotFoundException('Project not found');
  }
  await this.projectRepo.delete(id);  // ← projectImage key is abandoned
}
```

Contrast with `tasks.service.ts:deleteTask` (lines 324-343) which properly cleans up task images before deletion:

```typescript
async deleteTask(id: string, userId: string) {
  const task = await this.taskRepo.findById(id);
  ...
  if (task.images?.length) {
    for (const image of task.images) {
      await this.uploaderService.deleteResource(image.key).catch((err) => {
        this.logger.error(`Failed to delete task image: ${(err as Error).message}`);
      });
    }
  }
  await this.taskRepo.delete(id);
}
```

---

## Why It Matters

- Same as H6 — orphaned files accumulate in S3/local storage.
- Inconsistency between modules: tasks does cleanup, projects does not. This suggests the cleanup was simply forgotten.
- Every deleted project leaves one orphaned image behind. Over months, this adds up.

---

## Concrete Fix

```typescript
async deleteProject(id: string) {
  const project = await this.projectRepo.findById(id);
  if (!project) {
    throw new NotFoundException('Project not found');
  }

  if (project.projectImage) {
    await this.uploaderService.deleteResource(project.projectImage).catch((err) => {
      this.logger.error(`Failed to delete project image: ${(err as Error).message}`);
    });
  }

  await this.projectRepo.delete(id);
}
```

Note: `project.projectImage` stores the S3 key, not the resolved URL. The `findById` method loads it directly from the DB (no URL resolution), so `deleteResource(key)` can use it directly.

---

## Verification

1. Create a project with a cover image.
2. Delete the project.
3. Verify the image file no longer exists in S3/local storage.
