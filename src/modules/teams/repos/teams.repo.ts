import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../entity/teams.entity';
import { Repository, DeepPartial } from 'typeorm';
import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class TeamsRepository {
  constructor(
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
  ) {}

  create(payload: DeepPartial<Team>): Promise<Team> {
    const team = this.teamRepo.create(payload);
    return this.teamRepo.save(team);
  }
  async findById(
    id: string,
    relations?: { projects?: boolean; tasks?: boolean },
  ): Promise<Team> {
    return await this.teamRepo.findOneOrFail({
      where: { id },
      relations: relations ?? {},
    });
  }

  findTeams(): Promise<Team[]> {
    return this.teamRepo.find();
  }

  async update(id: string, payload: DeepPartial<Team>): Promise<Team> {
    const team = await this.getTeam(id);
    Object.assign(team, payload);
    return this.teamRepo.save(team);
  }

  async delete(id: string): Promise<void> {
    await this.getTeam(id);
    await this.teamRepo.delete({
      id: id,
    });
  }

  async activateTeam(id: string): Promise<Team> {
    const team = await this.getTeam(id);
    if (team.isActive) throw new BadRequestException('Team already active');

    team.isActive = true;
    return this.teamRepo.save(team);
  }

  async deactivateTeam(id: string): Promise<Team> {
    const team = await this.getTeam(id);
    if (!team.isActive)
      throw new BadRequestException('Team already not active ');

    team.isActive = false;
    return this.teamRepo.save(team);
  }

  private async getTeam(id: string): Promise<Team> {
    const team = await this.teamRepo.findOneBy({
      id,
    });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }
}
