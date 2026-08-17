import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import {
  NotificationsType,
  NotificationType,
  DEFAULT_NOTIFICATION_TYPE,
} from '../constants/notifications.const';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID the notification belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiPropertyOptional({
    description: 'Notification type',
    enum: NotificationsType,
    default: DEFAULT_NOTIFICATION_TYPE,
    example: DEFAULT_NOTIFICATION_TYPE,
  })
  @IsOptional()
  @IsEnum(NotificationsType)
  type?: NotificationType;

  @ApiProperty({
    description: 'Notification title',
    example: 'New task assigned',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @ApiProperty({
    description: 'Notification message body',
    example: 'You have been assigned to "Design login page mockup".',
  })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiPropertyOptional({
    description: 'ID of the referenced entity (e.g. task ID, project ID)',
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  referenceId?: string;

  @ApiPropertyOptional({
    description: 'Type of the referenced entity',
    example: 'task',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  referenceType?: string;
}
