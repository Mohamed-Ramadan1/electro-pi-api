# H1 — Projects Controller Endpoints Lack Ownership Checks

| Field      | Value |
|------------|-------|
| Severity   | **High** |
| Category   | Authorization |
| Files      | `src/modules/projects/controller/projects.controller.ts:102,115,127,138,149` |
|            | `src/modules/projects/services/projects.service.ts:90-96,98-114,117-129,131-141,144-155` |

---

## What's Wrong

The following project mutations are gated by `@Roles(UserRoles.ADMIN)` but have **no creator/membership check** within the service layer:

| Endpoint              | Controller Line | What It Allows                          |
|----------------------|-----------------|-----------------------------------------|
| DELETE `/:id`        | 102             | Any admin deletes any project           |
| POST `/:id/members`   | 115             | Any admin adds members to any project   |
| DELETE `/:id/members` | 127             | Any admin removes members from any project |
| PATCH `/:id/close`    | 138             | Any admin closes any project            |
| PATCH `/:id/reopen`   | 149             | Any admin reopens any project           |

The service methods:
```typescript
async deleteProject(id: string) {
  const project = await this.projectRepo.findById(id);
  if (!project) throw new NotFoundException('Project not found');
  await this.projectRepo.delete(id);  // ← no ownership check
}
```

Same pattern for `closeProject`, `reopenProject`, `addMember`, `removeMember`.

---

## Why It Matters

If the intent is "admins are superusers with full access," this is fine but should be documented. If admins should only manage their own projects (like the notes/tasks modules enforce via userId scoping), this is an authorization bypass.

The inconsistency with other modules (notes: always scoped by `userId`, tasks: project membership checked) suggests this is an oversight, not a deliberate choice.

---

## Concrete Fix

**If admins should be restricted to their own projects:**
```typescript
async deleteProject(id: string, userId: string) {
  const project = await this.projectRepo.findByIdAndUser(id, userId);
  if (!project) throw new NotFoundException('Project not found');
  await this.projectRepo.delete(id);
}
```

Then update the controller to pass `req.user.id`.

**If admins are superusers (document this):**
```typescript
// projects.controller.ts — add a comment at the class level:
// All mutation endpoints on this controller require ADMIN role.
// Admins have full access to all projects (create, delete, close, reopen, manage members).
```

---

## Verification

Check project deletion with admin-A and admin-B:
- Admin-A creates project P1.
- Admin-B tries to delete P1.
- Expected behavior depends on the chosen authorization model.
