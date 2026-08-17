import { Injectable } from '@nestjs/common';

// Repository imports
import { TeamsRepository } from '../repos/teams.repo';
import { TeamMembersRepository } from '../repos/teams-members.repo';
@Injectable()
export class TeamsService {
  constructor(
    private readonly teamsRepo: TeamsRepository,
    private readonly teamsMembersRepo: TeamMembersRepository,
  ) {}
}
