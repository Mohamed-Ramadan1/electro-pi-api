import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({
    description: 'Notification UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'Notification type',
    enum: [
      'task_assigned',
      'task_status_changed',
      'project_invited',
      'project_status_changed',
      'general',
    ],
    example: 'task_assigned',
  })
  type!: string;

  @ApiProperty({
    description: 'Notification title',
    example: 'New task assigned',
  })
  title!: string;

  @ApiProperty({
    description: 'Notification message body',
    example: 'You have been assigned to "Design login page mockup".',
  })
  message!: string;

  @ApiProperty({
    description: 'Whether the notification has been read',
    example: false,
  })
  isRead!: boolean;

  @ApiPropertyOptional({
    description: 'Timestamp when the notification was read (ISO 8601)',
    example: '2026-08-03T14:30:00.000Z',
  })
  readAt!: string | null;

  @ApiPropertyOptional({
    description: 'ID of the referenced entity (e.g. task ID, project ID)',
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    format: 'uuid',
  })
  referenceId!: string | null;

  @ApiPropertyOptional({
    description: 'Type of the referenced entity',
    example: 'task',
  })
  referenceType!: string | null;

  @ApiProperty({
    description: 'Creation timestamp (ISO 8601)',
    example: '2026-08-03T12:00:00.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Last-update timestamp (ISO 8601)',
    example: '2026-08-03T12:00:00.000Z',
  })
  updatedAt!: string;
}

export class NotificationsListResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Notifications retrieved successfully',
  })
  message!: string;

  @ApiProperty({
    description: 'List of notifications',
    type: [NotificationResponseDto],
  })
  notifications!: NotificationResponseDto[];
}

export class NotificationsCountResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Notifications count retrieved successfully',
  })
  message!: string;

  @ApiProperty({
    description: 'Total number of notifications for the authenticated user',
    example: 5,
  })
  count!: number;
}

export class MarkAsReadResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Notifications marked as read successfully',
  })
  message!: string;
}

export class DeleteNotificationResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Notification deleted successfully',
  })
  message!: string;
}

export class DeleteAllNotificationsResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'All notifications deleted successfully',
  })
  message!: string;
}
