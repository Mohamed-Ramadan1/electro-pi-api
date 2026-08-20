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

// services imports
import { TeamsService } from '../service/teams.service';
import { UpdateTeamDto } from '../dto/update-team.dto';
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
import { AddMemberToTeamDto } from '../dto/add-member-to-team.dto';

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
  async updateTeam(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    const team = await this.teamsService.updateTeam(id, dto);
    return {
      message: 'Team has been updated successfully.',
      data: {
        team,
      },
    };
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

  // Members related routes

  @Post(':teamId/members')
  @HttpCode(HttpStatus.CREATED)
  async addMemberToTeam(
    @Param('teamId') teamId: string,
    @Body() memberData: AddMemberToTeamDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const member = await this.teamsService.addMemberToTeam(
      teamId,
      memberData,
      user.id,
    );
    return {
      message: 'Member have been added to the team successfully.',
      data: {
        member,
      },
    };
  }

  @Get(':teamId/members')
  @HttpCode(HttpStatus.OK)
  async getTeamMembers(@Param('teamId') teamId: string) {
    const members = await this.teamsService.getTeamMembers(teamId);
    return {
      message: 'Members have been retrieved successfully.',
      results: members.length,
      data: {
        members,
      },
    };
  }

  @Get(':teamId/members/:memberId')
  @HttpCode(HttpStatus.OK)
  async getTeamMember(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
  ) {
    const member = await this.teamsService.getTeamMember(teamId, memberId);
    return {
      message: 'Member have been retrieved successfully.',
      data: {
        member,
      },
    };
  }

  @Delete(':teamId/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMemberFromTeam(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
  ) {
    await this.teamsService.removeMember(teamId, memberId);
  }

  @Patch(':teamId/members/:memberId/activate')
  @HttpCode(HttpStatus.OK)
  async activateMember(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
  ) {
    await this.teamsService.activateMember(teamId, memberId);
    return {
      message: 'Member have been activated successfully.',
    };
  }

  @Patch(':teamId/members/:memberId/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateMember(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
  ) {
    await this.teamsService.deactivateMember(teamId, memberId);
    return {
      message: 'Member have been deactivated successfully.',
    };
  }
}
