import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// controllers imports
import { TeamsController } from './controller/teams.controller';

// services imports
import { TeamsService } from './service/teams.service';

// repository imports
import { TeamsRepository } from './repos/teams.repo';

// entity imports
import { TeamsEntity } from './entity/teams.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeamsEntity])],
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository],
})
export class TeamsModule {}
