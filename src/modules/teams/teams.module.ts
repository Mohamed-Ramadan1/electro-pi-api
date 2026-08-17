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
import { TeamMemberEntity } from './entity/teams-members.entity';
import { TeamMembersRepository } from './repos/teams-members.repo';

@Module({
  imports: [TypeOrmModule.forFeature([TeamsEntity, TeamMemberEntity])],
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository, TeamMembersRepository],
})
export class TeamsModule {}
