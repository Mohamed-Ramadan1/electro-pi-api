import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';

// services imports
import { TeamsService } from '../service/teams.service';
import {
  Protected,
  Roles,
  RolesGuard,
  TransformResponseInterceptor,
  UserRoles,
} from '@common/index';

@Controller('teams')
@Protected()
@Roles(UserRoles.ADMIN)
@UseGuards(RolesGuard)
@UseInterceptors(TransformResponseInterceptor)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTeam() {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findTeams() {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findTeam() {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateTeam() {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTeam() {}

  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  activateTeam() {}

  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  deactivateTeam() {}
}
