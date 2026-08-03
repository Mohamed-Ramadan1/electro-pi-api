import { Controller } from '@nestjs/common';

//service imports
import { NotificationsService } from '../service/notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
}
