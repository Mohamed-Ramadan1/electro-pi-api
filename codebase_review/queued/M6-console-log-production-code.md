# M6 — `console.log` Debug Statements in Production Code

| Field      | Value |
|------------|-------|
| Severity   | **Medium** |
| Category   | Code Quality / Security |
| File       | `src/modules/projects/controller/projects.controller.ts:63-69,84-91` |

---

## What's Wrong

The projects controller's `create` method has raw `console.log` calls:

```typescript
console.log('[ProjectsController] CREATE called');
console.log('[ProjectsController] DTO:', JSON.stringify(dto));
console.log(
  '[ProjectsController] FILE:',
  file
    ? `${file.originalname} (${file.mimetype}, ${file.buffer.length}b)`
    : 'NONE',
);
// ... after creation:
console.log(
  '[ProjectsController] CREATED:',
  JSON.stringify({
    id: project.id,
    name: project.name,
    projectImage: project.projectImage,
  }),
);
```

---

## Why It Matters

- `console.log` bypasses the structured logger (`Logger` service used by other modules).
- In production, these logs go to stdout with no correlation ID, no timestamp formatting, and no log level filtering.
- `JSON.stringify(dto)` logs the full DTO — potentially including user PII (names, emails from members array).
- Debug statements left in production code indicate the code was deployed before review.

---

## Concrete Fix

Remove all `console.log` calls. If debug logging is genuinely needed, use the NestJS `Logger`:

```typescript
private readonly logger = new Logger(ProjectsController.name);

// Then:
this.logger.debug(`Creating project: ${dto.name}`);
```

Or simply delete them — the service layer already has logging.

---

## Verification

Grep the codebase for `console.log` — there should be zero results outside test files.
