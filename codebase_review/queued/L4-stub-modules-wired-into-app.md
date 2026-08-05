# L4 — Stub Modules Wired into the App Module Graph

| Field    | Value                                        |
| -------- | -------------------------------------------- |
| Severity | **Low**                                      |
| Category | Architecture / Cleanup                       |
| Files    | `src/infrastructure/queues/queues.module.ts` |
|          | `src/infrastructure/mails/mails.module.ts`   |
|          | `src/modules/dashboard/dashboard.module.ts`  |

---

## What's Wrong

Three modules are imported into the app but contain no real logic:

**QueuesModule** — empty, presumably for future BullMQ integration:

```typescript
@Module({})
export class QueuesModule {}
```

**MailsModule** — empty, presumably for future email sending:

```typescript
@Module({})
export class MailsModule {}
```

**DashboardModule** — stub controller + empty service:

```typescript
// controller
@Controller('dashboard')
export class DashboardController {}

// service
@Injectable()
export class DashboardService {}
```

---

## Why It Matters

- They add startup overhead (module resolution, metadata scanning) with zero value.
- They clutter the module graph, making it harder to understand the real dependency structure.
- If they're not shipped in the near future, they rot (imports become outdated, config drifts).

---

## Concrete Fix

Option A — Remove them from the import chain until they're implemented:

```typescript
// infrastructure.module.ts — remove QueuesModule, MailsModule
// modules.module.ts — remove DashboardModule
```

Option B — Add a clear `// TODO` comment in each stub file indicating the planned implementation timeline.

---

## Verification

After removal: `npx tsc --noEmit` passes. App boots without errors. Routes for `/dashboard` disappear.
