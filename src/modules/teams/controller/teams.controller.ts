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
  Param,
  Body,
} from '@nestjs/common';

import { Request } from 'express';

// services imports
import { TeamsService } from '../service/teams.service';
import {
  Protected,
  Roles,
  RolesGuard,
  TransformResponseInterceptor,
  UserRoles,
  CurrentUser,
  AuthenticatedUser,
} from '@common/index';

// Dto imports
import { CreateTeamDto } from '../dto/create-team.dto';

@Controller('teams')
@Protected()
@Roles(UserRoles.ADMIN)
@UseGuards(RolesGuard)
@UseInterceptors(TransformResponseInterceptor)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTeam(
    @Body() teamData: CreateTeamDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const team = await this.teamsService.createTeam(teamData, user.id);
    return {
      message: 'Team created successfully.',
      data: {
        team,
      },
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findTeams() {
    const teams = await this.teamsService.getTeams();
    return {
      message: 'Teams have been retrieved successfully.',
      results: teams.length,
      data: {
        teams,
      },
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findTeam(@Param('id') id: string) {
    const team = await this.teamsService.getTeam(id);
    return {
      message: 'Team data have been fetched successfully.',
      data: {
        team,
      },
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateTeam() {
    this.teamsService.updateTeam();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTeam(@Param('id') id: string) {
    this.teamsService.deleteTeam(id);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  async activateTeam(@Param('id') id: string) {
    await this.teamsService.activateTeam(id);
    return {
      message: 'Team activated successfully',
    };
  }

  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateTeam(@Param('id') id: string) {
    await this.teamsService.deactivateTeam(id);
    return {
      message: 'Team deactivated successfully',
    };
  }
}
