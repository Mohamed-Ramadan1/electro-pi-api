import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// controllers imports
import { EventsController } from './controller/events.controller';

// services imports
import { EventsService } from './service/events.service';

// repos imports
import { EventsRepo } from './repo/event.repo';

// entity imports
import { Event } from './entity/event.entity';
import { EventMember } from './entity/event-members.entity';
import { EventMemberRepo } from './repo/event-member.repo';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventMember])],
  providers: [EventsService, EventsRepo, EventMemberRepo],
  controllers: [EventsController],
})
export class EventsModule {}
