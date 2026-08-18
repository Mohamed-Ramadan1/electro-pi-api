import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { TeamMember } from '../entity/teams-members.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TeamMembersRepository {
  constructor(
    @InjectRepository(TeamMember)
    teamMembersRepo: Repository<TeamMember>,
  ) {}
}
