# L2 — Dead Barrel File `src/common/enums/index.ts`

| Field      | Value |
|------------|-------|
| Severity   | **Low** |
| Category   | Dead Code |
| File       | `src/common/enums/index.ts` |

---

## What's Wrong

The file exists but is empty:

```
src/common/enums/index.ts  →  0 lines
```

It's not imported anywhere. The `common/index.ts` barrel file does not re-export from `enums/`. All enum/constant definitions live in separate files (`roles.constants.ts`, `taskst.const.ts`, etc.).

---

## Concrete Fix

Delete the file and the empty `enums/` directory:

```bash
rm -r src/common/enums
```

---

## Verification

`find src -name "enums"` should return nothing. TypeScript compilation still passes.
