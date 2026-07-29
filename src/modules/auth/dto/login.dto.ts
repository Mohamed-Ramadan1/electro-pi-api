import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @ApiProperty({
    description: 'Registered email address',
    example: 'john@example.com',
    maxLength: 255,
  })
  @Transform(({ value }): unknown => {
    if (typeof value === 'string') {
      return value.toLowerCase().trim();
    }
    return value as unknown;
  })
  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Account password',
    example: 'Str0ng!Pass',
    maxLength: 128,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password!: string;
}
