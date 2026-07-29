import {
  Controller,
  Get,
  Patch,
  Req,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseGuards,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import {
  Protected,
  RolesGuard,
  TransformResponseInterceptor,
} from '@common/index';

import { TasksService } from '../services/tasks.service';
import { UpdateTaskStatusDto } from '../dto/update-task-status.dto';
import { Request } from 'express';

@ApiTags('Tasks - Members')
@ApiBearerAuth()
@Controller('members/tasks')
@Protected()
@UseGuards(RolesGuard)
@UseInterceptors(TransformResponseInterceptor)
export class TasksMembersController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({
    summary: 'List my tasks',
    description:
      'Returns every task where the authenticated user is the creator or assignee.',
  })
  @ApiResponse({ status: 200, description: 'Tasks retrieved.' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const tasks = await this.tasksService.findAll(req.user.id);
    return { message: 'Tasks retrieved successfully', tasks };
  }

  @ApiOperation({
    summary: 'Get tasks for a project',
    description:
      'Returns tasks in a project where the authenticated user is the creator or assignee.',
  })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved.' })
  @Get('project/:projectId')
  @HttpCode(HttpStatus.OK)
  async findByProject(
    @Req() req: Request,
    @Param('projectId') projectId: string,
  ) {
    const tasks = await this.tasksService.findByProject(projectId, req.user.id);
    return { message: 'Tasks retrieved successfully', tasks };
  }

  @ApiOperation({
    summary: 'Get a single task',
    description: 'Returns full task details by ID.',
  })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task retrieved.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const task = await this.tasksService.findOne(id);
    return { message: 'Task retrieved successfully', task };
  }

  @ApiOperation({
    summary: 'Update task status',
    description:
      'Allows the assignee or a project member to update the task status. Moving from done back to todo/inprogress clears completedAt.',
  })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task status updated.' })
  @ApiResponse({
    status: 404,
    description: 'Task not found or not assigned to you.',
  })
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    const task = await this.tasksService.updateTaskStatus(id, req.user.id, dto);
    return { message: 'Task status updated successfully', task };
  }
}
