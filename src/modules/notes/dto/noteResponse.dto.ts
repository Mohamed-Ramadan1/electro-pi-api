import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NoteResponseDto {
  @ApiProperty({
    description: 'Note UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'Note title',
    example: 'Meeting notes',
  })
  title!: string;

  @ApiPropertyOptional({
    description: 'Note content (plain text)',
    example: 'Discussed project timeline and deliverables.',
  })
  content!: string | null;

  @ApiPropertyOptional({
    description: 'Pre-signed URL of the attached image',
    example: 'https://bucket.s3.region.amazonaws.com/notes/...',
  })
  imageUrl!: string | null;

  @ApiProperty({
    description: 'Whether the note is active',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Creation timestamp (ISO 8601)',
    example: '2026-08-01T10:30:00.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Last-update timestamp (ISO 8601)',
    example: '2026-08-01T11:00:00.000Z',
  })
  updatedAt!: string;
}
