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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiExtraModels,
} from '@nestjs/swagger';

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
import { TeamResponseDto } from '../dto/team-response.dto';
import { TeamMemberResponseDto } from '../dto/team-member-response.dto';

@ApiTags('Teams')
@ApiBearerAuth()
@ApiExtraModels(TeamResponseDto, TeamMemberResponseDto)
@Controller('teams')
@Protected()
@Roles(UserRoles.ADMIN)
@UseGuards(RolesGuard)
@UseInterceptors(TransformResponseInterceptor)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Team created successfully.',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Team key already exists.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
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

  @ApiOperation({ summary: 'List all teams' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teams retrieved successfully.',
    type: [TeamResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
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

  @ApiOperation({ summary: 'Get a single team' })
  @ApiParam({ name: 'id', description: 'Team UUID', format: 'uuid' })
  @ApiQuery({
    name: 'include',
    required: false,
    description: 'Comma-separated relations to load. Allowed: projects, tasks.',
    example: 'projects,tasks',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Team data fetched successfully.',
    type: TeamResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Team not found.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findTeam(@Param('id') id: string, @Query('include') include?: string) {
    const relations = {
      projects: include?.split(',').includes('projects') ?? false,
      tasks: include?.split(',').includes('tasks') ?? false,
    };
    const team = await this.teamsService.getTeam(id, relations);
    return {
      message: 'Team data have been fetched successfully.',
      data: {
        team,
      },
    };
  }

  @ApiOperation({ summary: 'Update a team' })
  @ApiParam({ name: 'id', description: 'Team UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Team updated successfully.',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Team not found.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
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

  @ApiOperation({ summary: 'Delete a team' })
  @ApiParam({ name: 'id', description: 'Team UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Team deleted successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Team not found.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTeam(@Param('id') id: string) {
    this.teamsService.deleteTeam(id);
  }

  @ApiOperation({ summary: 'Activate a team' })
  @ApiParam({ name: 'id', description: 'Team UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Team activated successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Team not found.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Team already active.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  async activateTeam(@Param('id') id: string) {
    await this.teamsService.activateTeam(id);
    return {
      message: 'Team activated successfully',
    };
  }

  @ApiOperation({ summary: 'Deactivate a team' })
  @ApiParam({ name: 'id', description: 'Team UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Team deactivated successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Team not found.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Team already not active.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateTeam(@Param('id') id: string) {
    await this.teamsService.deactivateTeam(id);
    return {
      message: 'Team deactivated successfully',
    };
  }

  // Members related routes

  @ApiOperation({ summary: 'Add a member to a team' })
  @ApiParam({ name: 'teamId', description: 'Team UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Member added to the team successfully.',
    type: TeamMemberResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Team not found.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
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

  @ApiOperation({ summary: 'List all members of a team' })
  @ApiParam({ name: 'teamId', description: 'Team UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Members retrieved successfully.',
    type: [TeamMemberResponseDto],
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Team not found.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
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

  @ApiOperation({ summary: 'Get a single team member' })
  @ApiParam({ name: 'teamId', description: 'Team UUID', format: 'uuid' })
  @ApiParam({
    name: 'memberId',
    description: 'Team member UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member retrieved successfully.',
    type: TeamMemberResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
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

  @ApiOperation({ summary: 'Remove a member from a team' })
  @ApiParam({ name: 'teamId', description: 'Team UUID', format: 'uuid' })
  @ApiParam({
    name: 'memberId',
    description: 'Team member UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Member removed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @Delete(':teamId/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMemberFromTeam(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
  ) {
    await this.teamsService.removeMember(teamId, memberId);
  }

  @ApiOperation({ summary: 'Activate a team member' })
  @ApiParam({ name: 'teamId', description: 'Team UUID', format: 'uuid' })
  @ApiParam({
    name: 'memberId',
    description: 'Team member UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member activated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Member already active.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
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

  @ApiOperation({ summary: 'Deactivate a team member' })
  @ApiParam({ name: 'teamId', description: 'Team UUID', format: 'uuid' })
  @ApiParam({
    name: 'memberId',
    description: 'Team member UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member deactivated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Member already not active.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
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
