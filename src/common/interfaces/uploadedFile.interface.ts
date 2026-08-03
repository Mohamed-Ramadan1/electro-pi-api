export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export type UploadedFileOptional = UploadedFile | undefined;
