# H6 — Notes Update Doesn't Delete Old Image When Replaced

| Field      | Value |
|------------|-------|
| Severity   | **High** |
| Category   | Resource Leak / Storage |
| File       | `src/modules/notes/service/notes.service.ts:77-102` |

---

## What's Wrong

When updating a note with a new image, the old image is left in S3/local storage. The method uploads the new file, sets the new `imageKey`, and saves — but never deletes the previous `imageKey`:

```typescript
async updateNote(id: string, updateNoteDto: UpdateNoteDto, userId: string, file?: UploadedFile) {
  const note: Partial<CreateNoteType> = { ...updateNoteDto };

  if (file) {
    try {
      const { key } = await this.uploaderService.uploadResource(file, this.uploadFolderName);
      note.imageKey = key;  // ← sets NEW key, old key is abandoned
    } catch (err) {
      this.logger.error(`Failed to upload note image: ${(err as Error).message}`);
    }
  }

  const updated = await this.notesRepo.update(id, note, userId);
  await this.resolveImageUrl(updated);
  return updated;
}
```

---

## Why It Matters

- Every time a user replaces a note's image, an orphaned file is left in the S3 bucket or local `uploads/` directory.
- Over time, storage costs grow linearly with usage — the app never cleans up.
- For S3, each orphaned object consumes storage space indefinitely.
- For local storage, the `uploads/` directory grows without bound.

---

## Concrete Fix

Before uploading the new image, fetch the existing note to get the old key. After a successful upload, delete the old one:

```typescript
async updateNote(id: string, updateNoteDto: UpdateNoteDto, userId: string, file?: UploadedFile) {
  const note: Partial<CreateNoteType> = { ...updateNoteDto };

  if (file) {
    const existing = await this.notesRepo.findById(id, userId);
    const oldKey = existing?.imageKey;

    try {
      const { key } = await this.uploaderService.uploadResource(file, this.uploadFolderName);
      note.imageKey = key;

      if (oldKey) {
        await this.uploaderService.deleteResource(oldKey).catch((err) => {
          this.logger.error(`Failed to delete old note image: ${(err as Error).message}`);
        });
      }
    } catch (err) {
      this.logger.error(`Failed to upload note image: ${(err as Error).message}`);
    }
  }

  const updated = await this.notesRepo.update(id, note, userId);
  await this.resolveImageUrl(updated);
  return updated;
}
```

---

## Verification

1. Create a note with image → note has `imageKey: "uploads/notes/123-img.png"`.
2. Update the note with a new image → note has `imageKey: "uploads/notes/456-img2.png"`.
3. Verify the old key (`123-img.png`) no longer exists in S3/local storage.
