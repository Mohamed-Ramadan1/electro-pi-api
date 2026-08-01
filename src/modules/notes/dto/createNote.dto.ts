import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    description: 'Note title',
    example: 'Meeting notes',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional({
    description: 'Note content',
    example: 'Discussed project timeline and deliverables.',
  })
  @IsOptional()
  @IsString()
  content?: string;
}
