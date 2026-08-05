# M7 — `getEnvFilePaths` Exported but Never Used

| Field      | Value |
|------------|-------|
| Severity   | **Medium** |
| Category   | Dead Code / Configuration |
| File       | `src/core/utils/env.utils.ts:1-5` |

---

## What's Wrong

`getEnvFilePaths` is defined and exported but never called anywhere in the app:

```typescript
export function getEnvFilePaths(): string[] {
  const environment = process.env.NODE_ENV ?? 'development';
  return [`.env.${environment}`, '.env'];
}
```

The `ConfigModule` in `core.module.ts` hardcodes the env file path:

```typescript
ConfigModule.forRoot({
  cache: true,
  envFilePath: '.env',  // ← hardcoded, getEnvFilePaths never used
  isGlobal: true,
}),
```

---

## Why It Matters

- `.env.test` exists in the repo but is never loaded because `ConfigModule` only reads `.env`.
- Any environment-specific config (e.g., DB credentials for test runs) must be duplicated in `.env` or set as environment variables.
- The utility function was clearly written to solve this, then never wired in.

---

## Concrete Fix

Option A — Wire it in:
```typescript
ConfigModule.forRoot({
  cache: true,
  envFilePath: getEnvFilePaths(),
  isGlobal: true,
}),
```

Option B — Delete the function since `.env` loading is handled.

---

## Verification

In test environment (`NODE_ENV=test`), `ConfigModule` should load `.env.test` before `.env` as a fallback.
