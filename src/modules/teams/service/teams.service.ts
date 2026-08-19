import { Body, Injectable } from '@nestjs/common';

// Repository imports
import { TeamsRepository } from '../repos/teams.repo';
import { TeamMembersRepository } from '../repos/teams-members.repo';

// Entity imports
import { Team } from '../entity/teams.entity';
import { TeamMember } from '../entity/teams-members.entity';

// Dto imports
import { CreateTeamDto } from '../dto/create-team.dto';
import { DeepPartial } from 'typeorm';
@Injectable()
export class TeamsService {
  constructor(
    private readonly teamsRepo: TeamsRepository,
    private readonly teamsMembersRepo: TeamMembersRepository,
  ) {}

  createTeam(teamData: CreateTeamDto, userId: string): Promise<Team> {
    const payload: DeepPartial<Team> = {
      name: teamData.name,
      key: teamData.key,
      description: teamData.description,
      creator: { id: userId },
      members: teamData.members?.map((userId) => ({ user: { id: userId } })),
      projects: teamData.projects?.map((id) => ({ id })),
      tasks: teamData.tasks?.map((id) => ({ id })),
    };
    return this.teamsRepo.create(payload);
  }
  getTeams(): Promise<Team[]> {
    return this.teamsRepo.findTeams();
  }
  getTeam(id: string): Promise<Team> {
    return this.teamsRepo.findById(id);
  }
  updateTeam() {}
  deleteTeam() {}
  async activateTeam(id: string): Promise<void> {
    await this.teamsRepo.activateTeam(id);
  }
  async deactivateTeam(id: string): Promise<void> {
    await this.teamsRepo.deactivateTeam(id);
  }
}

/* 

The data coming form the forntnbed 
user (Who create this team)

// will have spechila case ot be handled throw 
in case of avatar existing / memebers of team if they existing 


// Projects and tasks as well 
*/
