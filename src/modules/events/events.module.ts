import { Module } from '@nestjs/common';

// controllers imports
import { EventsController } from './controller/events.controller';

//services imports
import { EventsService } from './service/events.service';

// repos imports
import { EventsRepo } from './repo/event.repo';

@Module({
  imports: [],
  providers: [EventsService, EventsRepo],
  controllers: [EventsController],
})
export class EventsModule {}
