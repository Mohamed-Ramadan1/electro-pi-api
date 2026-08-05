# Codebase Review — Executive Summary

**Date:** 2026-08-05
**Score:** 4/10
**Reviewer:** Staff-level hostile review, no reassurance

---

## What This Score Means

A 4 means the codebase has real security vulnerabilities, data integrity bugs, and authorization gaps that would cause incidents in production. The infrastructure layer (JWT, password hashing, S3 uploader) is well-constructed, but the business modules have critical issues that need fixing before deployment. This is not production-ready.

---

## Issue Distribution

| Severity | Count | Fix Window |
|----------|-------|------------|
| Critical | 4     | Before any deployment |
| High     | 7     | Within first sprint |
| Medium   | 9     | Within first month |
| Low      | 6     | As bandwidth permits |

---

## Top 3 Risks by Impact

1. **IDOR in tasks members `findOne`** — Any authenticated user can read any task by UUID, bypassing project boundaries entirely.
2. **Unawaited promise in notes activate/deactivate** — The UPDATE query fires but nobody waits for it. The returned entity has stale `isActive` state. Silent data corruption.
3. **Deactivated users can still log in** — The login query doesn't filter by `isActive: true`. Deactivated accounts get fresh tokens.

---

## What's Good

- **JWT infrastructure** — Dual-secret, type-gated tokens with issuer/audience validation. Clean `ttlToSeconds` parser. Production-only secret enforcement.
- **S3 uploader** — S3-first with graceful local fallback. Structured error logging. Correct key prefixing across all operations.
- **Global exception filter** — Correlation IDs per request. Dev-only stack traces. Polymorphic message extraction.
- **Tasks service authorization** — Project membership validation with dedicated `validateProjectMembership`/`ensureProjectAccess`/`validateAssignable` methods. Image cleanup on task delete is thorough.
- **Base entity** — UUID PK with `gen_random_uuid()`, created/updated timestamps, soft-delete via `isActive`. Consistent across all entities.

---

## What's Broken (Critical)

| Code | File | Issue |
|------|------|-------|
| C1   | `tasks-members.controller.ts:79` | IDOR: any member reads any task |
| C2   | `notes.repo.ts:56,64` | Unawaited `update()` — stale data returned |
| C3   | `user.repo.ts:17` / `auth.service.ts:51` | Deactivated users can log in |
| C4   | `auth.guard.ts:47` | All errors masked as "invalid token" |

---

## Architecture Summary

```
Layers:
  Core        → Throttler, Config, Swagger, ValidationPipe, Helmet, CORS
  Common      → Guards, Filters, Interceptors, Decorators, Base Entity, Pipes
  Infrastructure → JWT, Password, S3 Uploader, DB, Queues (stub), Mails (stub)
  Modules     → Auth, Users, Projects, Tasks, Notes, Notifications, Reminders, Dashboard (stub)
```

**Layering is generally correct.** Controllers handle HTTP, services handle business logic, repos handle data access. Exceptions:
- `tasks.service.ts` injects `Repository<Project>` directly (bypassing a project repo layer). This is acceptable but inconsistent.
- `notifications.service.ts` is a pure proxy — every method is a one-line delegation to the repo. Questionable whether this layer adds value in its current form.

---

## Test Coverage

**Unit tests exist for:** `auth.controller`, `auth.service`, `token.service`, `password.service`.  
**Integration tests exist for:** `user.repo`.  
**E2E tests exist for:** app bootstrap (basic smoke test).

**Missing:** No tests for authorization logic (IDOR scenarios), no tests for the notes repo's unawaited-update bug, no tests for any controller beyond auth. Critical paths (tasks authorization, project membership, file uploads) have zero test coverage.

---

## What to Do First

1. Fix C2 (one `await` — fix is one character, risk is data corruption)
2. Fix C1 (IDOR — add user scoping to `findOne`)
3. Fix C3 (deactivated login — add `isActive: true` to the query)
4. Fix C4 (error masking — narrow the catch to JWT errors only)
5. Apply rate limiting to auth endpoints
6. Convert `reminderAt` string→Date in the reminders repo
7. Add file validation to all upload endpoints

Each issue has its own file in `../queued/` with full details, file/line references, and concrete fixes.
