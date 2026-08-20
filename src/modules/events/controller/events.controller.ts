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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiExtraModels,
} from '@nestjs/swagger';

import {
  Protected,
  Roles,
  RolesGuard,
  TransformResponseInterceptor,
  UserRoles,
  CurrentUser,
  AuthenticatedUser,
} from '@common/index';

// service imports
import { EventsService } from '../service/events.service';

// Dto imports
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { InviteMemberDto } from '../dto/invite-member.dto';
import { UpdateMemberRoleDto } from '../dto/update-member-role.dto';
import { RescheduleEventDto } from '../dto/reschedule-event.dto';
import { CheckConflictDto } from '../dto/check-conflict.dto';

// Response Dto imports
import { EventResponseDto } from '../dto/event-response.dto';
import { EventMemberResponseDto } from '../dto/event-member-response.dto';

@ApiTags('Events')
@ApiBearerAuth()
@ApiExtraModels(EventResponseDto, EventMemberResponseDto)
@Controller('events')
@Protected()
@Roles(UserRoles.ADMIN)
@UseGuards(RolesGuard)
@UseInterceptors(TransformResponseInterceptor)
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Event created successfully.',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createEvent(
    @Body() eventData: CreateEventDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const event = await this.eventService.createEvent(eventData, user.id);
    return {
      message: 'Event created successfully.',
      data: {
        event,
      },
    };
  }

  @ApiOperation({ summary: 'List all events' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Events retrieved successfully.',
    type: [EventResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getEvents() {
    const events = await this.eventService.getEvents();
    return {
      message: 'Events retrieved successfully.',
      results: events.length,
      data: {
        events,
      },
    };
  }

  @ApiOperation({ summary: 'Clone an existing event' })
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Event cloned successfully.',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found.',
  })
  @Post(':id/clone')
  @HttpCode(HttpStatus.CREATED)
  async cloneEvent(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const event = await this.eventService.cloneEvent(id, user.id);
    return {
      message: 'Event cloned successfully.',
      data: {
        event,
      },
    };
  }

  @ApiOperation({ summary: 'List upcoming events' })
  @Roles(UserRoles.MEMBER, UserRoles.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Upcoming events retrieved successfully.',
    type: [EventResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @Get('upcoming')
  @HttpCode(HttpStatus.OK)
  async getUpcomingEvents() {
    const events = await this.eventService.getUpcomingEvents();
    return {
      message: 'Upcoming events retrieved successfully.',
      results: events.length,
      data: {
        events,
      },
    };
  }

  @ApiOperation({ summary: 'List events for the current user' })
  @Roles(UserRoles.MEMBER, UserRoles.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Events retrieved successfully.',
    type: [EventResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @Get('my')
  @HttpCode(HttpStatus.OK)
  async getMyEvents(@CurrentUser() user: AuthenticatedUser) {
    const events = await this.eventService.getMyEvents(user.id);
    return {
      message: 'Events retrieved successfully.',
      results: events.length,
      data: {
        events,
      },
    };
  }

  @ApiOperation({ summary: 'List invitations for the current user' })
  @Roles(UserRoles.MEMBER, UserRoles.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invitations retrieved successfully.',
    type: [EventMemberResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @Get('invitations')
  @HttpCode(HttpStatus.OK)
  async getMyInvitations(@CurrentUser() user: AuthenticatedUser) {
    const invitations = await this.eventService.getMyInvitations(user.id);
    return {
      message: 'Invitations retrieved successfully.',
      results: invitations.length,
      data: {
        invitations,
      },
    };
  }

  @ApiOperation({ summary: 'Check conflicts for the current user' })
  @Roles(UserRoles.MEMBER, UserRoles.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conflict check completed successfully.',
    type: [EventResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @Post('check-conflict')
  @HttpCode(HttpStatus.OK)
  async checkConflict(
    @Body() data: CheckConflictDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const conflicts = await this.eventService.checkConflict(user.id, data);
    return {
      message: 'Conflict check completed successfully.',
      data: {
        conflicts,
      },
    };
  }

  @ApiOperation({ summary: 'Get a single event' })
  @Roles(UserRoles.MEMBER, UserRoles.ADMIN)
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Event retrieved successfully.',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found.',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getEvent(@Param('id') id: string) {
    const event = await this.eventService.getEvent(id);
    return {
      message: 'Event retrieved successfully.',
      data: {
        event,
      },
    };
  }

  @ApiOperation({ summary: 'Update an event' })
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Event updated successfully.',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found.',
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateEvent(
    @Param('id') id: string,
    @Body() eventData: UpdateEventDto,
  ) {
    const event = await this.eventService.updateEvent(id, eventData);
    return {
      message: 'Event updated successfully.',
      data: {
        event,
      },
    };
  }

  @ApiOperation({ summary: 'Delete an event' })
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Event deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEvent(@Param('id') id: string) {
    await this.eventService.deleteEvent(id);
  }

  @ApiOperation({ summary: 'Activate an event' })
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Event activated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Event already active.',
  })
  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  async activateEvent(@Param('id') id: string) {
    await this.eventService.activateEvent(id);
    return {
      message: 'Event activated successfully.',
    };
  }

  @ApiOperation({ summary: 'Deactivate an event' })
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Event deactivated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Event already not active.',
  })
  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateEvent(@Param('id') id: string) {
    await this.eventService.deactivateEvent(id);
    return {
      message: 'Event deactivated successfully.',
    };
  }

  @ApiOperation({ summary: 'Reschedule an event' })
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Event rescheduled successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found.',
  })
  @Patch(':id/reschedule')
  @HttpCode(HttpStatus.OK)
  async rescheduleEvent(
    @Param('id') id: string,
    @Body() rescheduleData: RescheduleEventDto,
  ) {
    await this.eventService.rescheduleEvent(id, rescheduleData);
    return {
      message: 'Event rescheduled successfully.',
    };
  }

  @ApiOperation({ summary: 'Check conflicts for an event' })
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conflicts checked successfully.',
    type: [EventResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found.',
  })
  @Get(':id/conflicts')
  @HttpCode(HttpStatus.OK)
  async checkConflicts(@Param('id') id: string) {
    const conflicts = await this.eventService.checkConflicts(id);
    return {
      message: 'Conflicts checked successfully.',
      data: {
        conflicts,
      },
    };
  }

  @ApiOperation({ summary: 'Get event history' })
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Event history retrieved successfully.',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found.',
  })
  @Get(':id/history')
  @HttpCode(HttpStatus.OK)
  async getEventHistory(@Param('id') id: string) {
    const history = await this.eventService.getEventHistory(id);
    return {
      message: 'Event history retrieved successfully.',
      data: {
        history,
      },
    };
  }

  @ApiOperation({ summary: 'List event members' })
  @Roles(UserRoles.MEMBER, UserRoles.ADMIN)
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Event members retrieved successfully.',
    type: [EventMemberResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found.',
  })
  @Get(':id/members')
  @HttpCode(HttpStatus.OK)
  async getEventMembers(@Param('id') id: string) {
    const members = await this.eventService.getEventMembers(id);
    return {
      message: 'Event members retrieved successfully.',
      results: members.length,
      data: {
        members,
      },
    };
  }

  @ApiOperation({ summary: 'Remove a member from an event' })
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiParam({
    name: 'memberId',
    description: 'Event member UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Member removed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member not found.',
  })
  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    await this.eventService.removeMember(id, memberId);
  }

  @ApiOperation({ summary: 'Update a member role on an event' })
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiParam({
    name: 'memberId',
    description: 'Event member UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member role updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member not found.',
  })
  @Patch(':id/members/:memberId/role')
  @HttpCode(HttpStatus.OK)
  async updateMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() roleData: UpdateMemberRoleDto,
  ) {
    await this.eventService.updateMemberRole(id, memberId, roleData);
    return {
      message: 'Member role updated successfully.',
    };
  }

  @ApiOperation({ summary: 'Invite a member to an event' })
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Member invited successfully.',
    type: EventMemberResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already invited or a member of this event.',
  })
  @Post(':id/invite')
  @HttpCode(HttpStatus.CREATED)
  async inviteMember(
    @Param('id') id: string,
    @Body() inviteData: InviteMemberDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const invitation = await this.eventService.inviteMember(
      id,
      inviteData,
      user.id,
    );
    return {
      message: 'Member invited successfully.',
      data: {
        invitation,
      },
    };
  }

  @ApiOperation({ summary: 'List invitations for an event' })
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invitations retrieved successfully.',
    type: [EventMemberResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found.',
  })
  @Get(':id/invitations')
  @HttpCode(HttpStatus.OK)
  async getInvitations(@Param('id') id: string) {
    const invitations = await this.eventService.getInvitations(id);
    return {
      message: 'Invitations retrieved successfully.',
      results: invitations.length,
      data: {
        invitations,
      },
    };
  }

  @ApiOperation({ summary: 'Cancel a member invitation' })
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiParam({
    name: 'invitationId',
    description: 'Invitation UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invitation cancelled successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invitation not found.',
  })
  @Patch(':id/invitations/:invitationId/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelMemberInvitation(
    @Param('id') id: string,
    @Param('invitationId') invitationId: string,
  ) {
    await this.eventService.cancelMemberInvitation(id, invitationId);
    return {
      message: 'Invitation cancelled successfully.',
    };
  }

  @ApiOperation({ summary: 'Accept an invitation' })
  @Roles(UserRoles.MEMBER, UserRoles.ADMIN)
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiParam({
    name: 'invitationId',
    description: 'Invitation UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invitation accepted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invitation not found.',
  })
  @Patch(':id/invitations/:invitationId/accept')
  @HttpCode(HttpStatus.OK)
  async acceptInvitation(
    @Param('id') id: string,
    @Param('invitationId') invitationId: string,
  ) {
    await this.eventService.acceptInvitation(id, invitationId);
    return {
      message: 'Invitation accepted successfully.',
    };
  }

  @ApiOperation({ summary: 'Decline an invitation' })
  @Roles(UserRoles.MEMBER, UserRoles.ADMIN)
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiParam({
    name: 'invitationId',
    description: 'Invitation UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invitation declined successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invitation not found.',
  })
  @Patch(':id/invitations/:invitationId/decline')
  @HttpCode(HttpStatus.OK)
  async declineInvitation(
    @Param('id') id: string,
    @Param('invitationId') invitationId: string,
  ) {
    await this.eventService.declineInvitation(id, invitationId);
    return {
      message: 'Invitation declined successfully.',
    };
  }

  @ApiOperation({ summary: 'Leave an event' })
  @Roles(UserRoles.MEMBER, UserRoles.ADMIN)
  @ApiParam({ name: 'id', description: 'Event UUID', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Left event successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'You are not a member of this event.',
  })
  @Delete(':id/leave')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leaveEvent(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.eventService.leaveEvent(id, user.id);
  }
}
