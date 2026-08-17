import { InjectRepository } from '@nestjs/typeorm';
import { TeamsEntity } from '../entity/teams.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TeamsRepository {
  constructor(
    @InjectRepository(TeamsEntity) teamsRepo: Repository<TeamsEntity>,
  ) {}
}
