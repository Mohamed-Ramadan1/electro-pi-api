# L3 — `createdIn` Field on Project Entity Has No Apparent Purpose

| Field      | Value |
|------------|-------|
| Severity   | **Low** |
| Category   | Dead Code / Schema Bloat |
| File       | `src/modules/projects/entity/project.entity.ts:24-25` |

---

## What's Wrong

The `projects` table has a `createdIn` varchar column that is never referenced:

```typescript
@Column({ type: 'varchar', length: 255, nullable: true })
createdIn!: string | null;
```

- Not in any DTO
- Not in any service method
- Not in any response
- Not set during project creation
- The migration file includes it but no code touches it

---

## Concrete Fix

Either:
1. Remove the column from the entity and create a new migration to drop it.
2. If it's intended for future use, add a comment:
   ```typescript
   /** Reserved for workspace/team context (future feature). Not yet wired. */
   @Column({ type: 'varchar', length: 255, nullable: true })
   createdIn!: string | null;
   ```

---

## Verification

Check that no code references `createdIn` — `rg "createdIn" src/` should only return the entity definition.
