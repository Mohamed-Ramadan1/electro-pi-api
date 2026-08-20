import { Injectable } from '@nestjs/common';

// Repository imports
import { TeamsRepository } from '../repos/teams.repo';
import { TeamMembersRepository } from '../repos/teams-members.repo';

// Entity imports
import { Team } from '../entity/teams.entity';
import { TeamMember } from '../entity/teams-members.entity';

// Dto imports
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';
import { DeepPartial } from 'typeorm';
import { AddMemberToTeamDto } from '../dto/add-member-to-team.dto';
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
  updateTeam(id: string, teamData: UpdateTeamDto): Promise<Team> {
    return this.teamsRepo.update(id, this.buildTeamPayload(teamData));
  }

  deleteTeam(id: string): Promise<void> {
    return this.teamsRepo.delete(id);
  }
  async activateTeam(id: string): Promise<void> {
    await this.teamsRepo.activateTeam(id);
  }
  async deactivateTeam(id: string): Promise<void> {
    await this.teamsRepo.deactivateTeam(id);
  }

  // Members services methods
  getTeamMembers(teamId: string): Promise<TeamMember[]> {
    return this.teamsMembersRepo.getTeamMembers(teamId);
  }
  getTeamMember(teamId: string, memberId: string): Promise<TeamMember> {
    return this.teamsMembersRepo.getTeamMember(teamId, memberId);
  }
  addMemberToTeam(
    teamId: string,
    data: AddMemberToTeamDto,
    creator: string,
  ): Promise<TeamMember> {
    const payload: DeepPartial<TeamMember> = {
      team: { id: teamId },
      user: { id: data.userId },
      role: data.role,
      creator: { id: creator },
    };
    return this.teamsMembersRepo.addMemberToTeam(payload);
  }

  removeMember(teamId: string, memberId: string): Promise<void> {
    return this.teamsMembersRepo.removeMember(teamId, memberId);
  }
  activateMember(teamId: string, memberId: string): Promise<void> {
    return this.teamsMembersRepo.activateMember(teamId, memberId);
  }
  deactivateMember(teamId: string, memberId: string): Promise<void> {
    return this.teamsMembersRepo.deactivateMember(teamId, memberId);
  }

  // Helpers methods
  private buildTeamPayload(teamData: UpdateTeamDto): DeepPartial<Team> {
    const payload: DeepPartial<Team> = {};
    if (teamData.name !== undefined) payload.name = teamData.name;
    if (teamData.key !== undefined) payload.key = teamData.key;
    if (teamData.description !== undefined)
      payload.description = teamData.description;
    if (teamData.avatar !== undefined) payload.avatar = teamData.avatar;
    if (teamData.members !== undefined)
      payload.members = teamData.members.map((userId) => ({
        user: { id: userId },
      }));
    if (teamData.projects !== undefined)
      payload.projects = teamData.projects.map((id) => ({ id }));
    if (teamData.tasks !== undefined)
      payload.tasks = teamData.tasks.map((id) => ({ id }));

    return payload;
  }
}
