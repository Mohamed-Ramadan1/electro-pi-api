import { Injectable } from '@nestjs/common';

// Repository imports
import { TeamsRepository } from '../repos/teams.repo';
import { TeamMembersRepository } from '../repos/teams-members.repo';

// Entity imports
import { TeamMember } from '../entity/teams-members.entity';
import { Team } from '../entity/teams.entity';

@Injectable()
export class TeamsService {
  constructor(
    private readonly teamsRepo: TeamsRepository,
    private readonly teamsMembersRepo: TeamMembersRepository,
  ) {}

  createTeam() {}
  getTeams() {}
  getTeam() {}
  updateTeam() {}
  deleteTeam() {}
  activateTeam() {}
  deactivateTeam() {}
}
