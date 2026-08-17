import { Controller } from '@nestjs/common';

// services imports
import { TeamsService } from '../service/teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  findTeams() {}

  findTeam() {}

  createTeam() {}

  updateTeam() {}

  deleteTeam() {}

  activateTeam() {}

  deactivateTeam() {}
}
