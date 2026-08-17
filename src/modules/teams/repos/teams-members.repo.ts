import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { TeamMemberEntity } from '../entity/teams-members.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TeamMembersRepository {
  constructor(
    @InjectRepository(TeamMemberEntity)
    teamMembersRepo: Repository<TeamMemberEntity>,
  ) {}
}
