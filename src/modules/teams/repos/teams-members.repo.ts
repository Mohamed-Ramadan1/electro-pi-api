import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, Repository } from 'typeorm';
import { TeamMember } from '../entity/teams-members.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class TeamMembersRepository {
  constructor(
    @InjectRepository(TeamMember)
    private teamMembersRepo: Repository<TeamMember>,
  ) {}

  getTeamMembers(teamId: string): Promise<TeamMember[]> {
    return this.teamMembersRepo.find({
      where: { team: { id: teamId } },
    });
  }
  getTeamMember(teamId: string, memberId: string): Promise<TeamMember> {
    return this.getMemberById(teamId, memberId);
  }
  addMemberToTeam(memberInfo: DeepPartial<TeamMember>): Promise<TeamMember> {
    const member = this.teamMembersRepo.create(memberInfo);
    return this.teamMembersRepo.save(member);
  }

  async removeMember(teamId: string, memberId: string): Promise<void> {
    const member = await this.getMemberById(teamId, memberId);
    await this.teamMembersRepo.delete({ id: member.id });
  }

  async activateMember(teamId: string, memberId: string): Promise<void> {
    const member = await this.getMemberById(teamId, memberId);
    if (member.isActive)
      throw new BadRequestException('Member already active.');
    member.isActive = true;
    this.teamMembersRepo.save(member);
  }

  async deactivateMember(teamId: string, memberId: string): Promise<void> {
    const member = await this.getMemberById(teamId, memberId);
    if (!member.isActive)
      throw new BadRequestException('Member already not active.');
    member.isActive = false;
    this.teamMembersRepo.save(member);
  }

  private async getMemberById(
    teamId: string,
    memberId: string,
  ): Promise<TeamMember> {
    const member = await this.teamMembersRepo.findOneBy({
      team: { id: teamId },
      id: memberId,
    });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }
}
