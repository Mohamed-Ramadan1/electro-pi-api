import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Req,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseGuards,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';

import {
  Protected,
  Roles,
  UserRoles,
  RolesGuard,
  TransformResponseInterceptor,
} from '@common/index';

import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

import { Request } from 'express';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@Protected()
@Roles(UserRoles.ADMIN)
@UseGuards(RolesGuard)
@UseInterceptors(TransformResponseInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 10))
  async create(
    @Req() req: Request,
    @Body() dto: CreateTaskDto,
    @UploadedFiles()
    files?: { buffer: Buffer; originalname: string; mimetype: string }[],
  ) {
    const task = await this.tasksService.createTask(
      dto,
      req.user.id,
      files?.map((f) => ({
        buffer: f.buffer,
        originalname: f.originalname,
        mimetype: f.mimetype,
      })),
    );

    return { message: 'Task created successfully', task };
  }

  @ApiOperation({ summary: 'List all tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved.' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const tasks = await this.tasksService.findAll(req.user.id);
    return { message: 'Tasks retrieved successfully', tasks };
  }

  @ApiOperation({ summary: 'Get tasks by project' })
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

  @ApiOperation({ summary: 'Get a single task' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task retrieved.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const task = await this.tasksService.findOne(id);
    return { message: 'Task retrieved successfully', task };
  }

  @ApiOperation({ summary: 'Update a task' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task updated.' })
  @ApiResponse({ status: 403, description: 'Not a member of the project.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('files', 10))
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @UploadedFiles()
    files?: { buffer: Buffer; originalname: string; mimetype: string }[],
  ) {
    const task = await this.tasksService.updateTask(
      id,
      req.user.id,
      dto,
      files?.map((f) => ({
        buffer: f.buffer,
        originalname: f.originalname,
        mimetype: f.mimetype,
      })),
    );

    return { message: 'Task updated successfully', task };
  }

  @ApiOperation({ summary: 'Assign a task to a user' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Task assigned.' })
  @ApiResponse({
    status: 403,
    description: 'Not a member of the project / User is not a project member.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @Patch(':id/assign/:userId')
  @HttpCode(HttpStatus.OK)
  async assign(
    @Req() req: Request,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    const task = await this.tasksService.assignTask(id, userId, req.user.id);
    return { message: 'Task assigned successfully', task };
  }

  @ApiOperation({ summary: 'Unassign a task' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task unassigned.' })
  @ApiResponse({ status: 403, description: 'Not a member of the project.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @Delete(':id/assign')
  @HttpCode(HttpStatus.OK)
  async unassign(@Req() req: Request, @Param('id') id: string) {
    const task = await this.tasksService.unassignTask(id, req.user.id);
    return { message: 'Task unassigned successfully', task };
  }

  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task deleted.' })
  @ApiResponse({ status: 403, description: 'Not a member of the project.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteTask(@Req() req: Request, @Param('id') id: string) {
    await this.tasksService.deleteTask(id, req.user.id);
    return { message: 'Task deleted successfully' };
  }
}
