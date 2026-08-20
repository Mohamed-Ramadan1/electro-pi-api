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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import {
  Protected,
  Roles,
  RolesGuard,
  TransformResponseInterceptor,
  UserRoles,
} from '@common/index';

// service imports
import { EventsService } from '../service/events.service';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('events')
@Protected()
@Roles(UserRoles.ADMIN)
@UseGuards(RolesGuard)
@UseInterceptors(TransformResponseInterceptor)
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @ApiOperation({ summary: 'Create a new event' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createEvent() {
    const event = await this.eventService.createEvent();
    return {
      message: 'Event created successfully.',
      data: {
        event,
      },
    };
  }

  @ApiOperation({ summary: 'Clone an existing event' })
  @Post(':id/clone')
  @HttpCode(HttpStatus.CREATED)
  async cloneEvent(@Param('id') id: string) {
    const event = await this.eventService.cloneEvent(id);
    return {
      message: 'Event cloned successfully.',
      data: {
        event,
      },
    };
  }

  @ApiOperation({ summary: 'List all events' })
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

  @ApiOperation({ summary: 'List upcoming events' })
  @Roles(UserRoles.MEMBER, UserRoles.ADMIN)
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
  @Get('my')
  @HttpCode(HttpStatus.OK)
  async getMyEvents() {
    const events = await this.eventService.getMyEvents();
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
  @Get('invitations')
  @HttpCode(HttpStatus.OK)
  async getMyInvitations() {
    const invitations = await this.eventService.getMyInvitations();
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
  @Post('check-conflict')
  @HttpCode(HttpStatus.OK)
  async checkConflict() {
    const conflicts = await this.eventService.checkConflict();
    return {
      message: 'Conflict check completed successfully.',
      data: {
        conflicts,
      },
    };
  }

  @ApiOperation({ summary: 'Get a single event' })
  @Roles(UserRoles.MEMBER, UserRoles.ADMIN)
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
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateEvent(@Param('id') id: string) {
    const event = await this.eventService.updateEvent(id);
    return {
      message: 'Event updated successfully.',
      data: {
        event,
      },
    };
  }

  @ApiOperation({ summary: 'Delete an event' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteEvent(@Param('id') id: string) {
    this.eventService.deleteEvent(id);
  }

  @ApiOperation({ summary: 'Activate an event' })
  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  async activateEvent(@Param('id') id: string) {
    await this.eventService.activateEvent(id);
    return {
      message: 'Event activated successfully.',
    };
  }

  @ApiOperation({ summary: 'Deactivate an event' })
  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateEvent(@Param('id') id: string) {
    await this.eventService.deactivateEvent(id);
    return {
      message: 'Event deactivated successfully.',
    };
  }

  @ApiOperation({ summary: 'Reschedule an event' })
  @Patch(':id/reschedule')
  @HttpCode(HttpStatus.OK)
  async rescheduleEvent(@Param('id') id: string) {
    await this.eventService.rescheduleEvent(id);
    return {
      message: 'Event rescheduled successfully.',
    };
  }

  @ApiOperation({ summary: 'Check conflicts for an event' })
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
  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMember(@Param('id') id: string, @Param('memberId') memberId: string) {
    this.eventService.removeMember(id, memberId);
  }

  @ApiOperation({ summary: 'Update a member role on an event' })
  @Patch(':id/members/:memberId/role')
  @HttpCode(HttpStatus.OK)
  async updateMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    await this.eventService.updateMemberRole(id, memberId);
    return {
      message: 'Member role updated successfully.',
    };
  }

  @ApiOperation({ summary: 'Invite a member to an event' })
  @Post(':id/invite')
  @HttpCode(HttpStatus.CREATED)
  async inviteMember(@Param('id') id: string) {
    const invitation = await this.eventService.inviteMember(id);
    return {
      message: 'Member invited successfully.',
      data: {
        invitation,
      },
    };
  }

  @ApiOperation({ summary: 'List invitations for an event' })
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
  @Delete(':id/leave')
  @HttpCode(HttpStatus.NO_CONTENT)
  leaveEvent(@Param('id') id: string) {
    this.eventService.leaveEvent(id);
  }
}
