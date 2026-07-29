import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRoles, UserRole } from '@common/index';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'Email address used for login',
    example: 'john@example.com',
    maxLength: 255,
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }): unknown => {
    if (typeof value === 'string') {
      return value.toLowerCase().trim();
    }
    return value as unknown;
  })
  @MaxLength(255)
  email!: string;

  @ApiProperty({
    description: 'Account password',
    example: 'Str0ng!Pass',
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @ApiPropertyOptional({
    description: 'Roles assigned to the user',
    example: [UserRoles.MEMBER],
    enum: UserRoles,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(UserRoles, { each: true })
  roles?: UserRole[];
}
