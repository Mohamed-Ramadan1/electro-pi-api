import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../entity/teams.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TeamsRepository {
  constructor(@InjectRepository(Team) teamsRepo: Repository<Team>) {}
}
