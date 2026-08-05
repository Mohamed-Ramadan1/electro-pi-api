# H4 — No File Type/Size Validation on Task and Project Uploads

| Field      | Value |
|------------|-------|
| Severity   | **High** |
| Category   | Security / Abuse Prevention |
| Files      | `src/modules/tasks/controller/tasks.controller.ts:56` |
|            | `src/modules/projects/controller/projects.controller.ts:56` |

---

## What's Wrong

The notes controller applies `FileSizeValidationPipe` to uploaded files (2 MB limit). But tasks and projects do not:

**Tasks** (`tasks.controller.ts:56`):
```typescript
@UseInterceptors(FilesInterceptor('files', 10))  // no file filter, no size pipe
```

**Projects** (`projects.controller.ts:56`):
```typescript
@UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))  // no pipe
```

---

## Why It Matters

- **No file type filter:** Users can upload arbitrary files (executables, scripts, archives) to S3. This increases storage costs and introduces abuse vectors (someone could use your S3 bucket as a file-sharing host).
- **No size limit:** A user can upload multi-gigabyte files to S3 via the tasks endpoint (up to 10 files per request). This is a direct path to massive S3 bills.
- Only notes had `FileSizeValidationPipe` applied — the inconsistency suggests it was simply forgotten for the other two modules.

---

## Concrete Fix

**Option A — Add the pipe to all upload endpoints:**
```typescript
// projects.controller.ts
@UploadedFile(new FileSizeValidationPipe())
file?: { buffer: Buffer; originalname: string; mimetype: string },

// tasks.controller.ts
@UploadedFiles(new FileSizeValidationPipe())
files?: { buffer: Buffer; originalname: string; mimetype: string }[],
```

**Option B — Add a MIME-type guard (recommended for both):**
```typescript
@UseInterceptors(
  FileInterceptor('file', {
    storage: memoryStorage(),
    fileFilter: (_req, file, cb) => {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException(`File type ${file.mimetype} not allowed`), false);
      }
    },
    limits: { fileSize: 2 * 1024 * 1024 },  // 2 MB
  }),
)
```

Option B is preferrable because it rejects bad files before they reach the service layer (and before they consume server memory).

---

## Verification

- Upload a 50 MB file → should be rejected with 413 or 400.
- Upload a `.exe` file → should be rejected with 400 "file type not allowed."
