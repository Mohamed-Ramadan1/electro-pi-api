import {
  Controller,
  Post,
  Delete,
  Patch,
  Req,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { memoryStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
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

import { ProjectsService } from '../services/projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';

import { Request } from 'express';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
@Protected()
@Roles(UserRoles.ADMIN)
@UseGuards(RolesGuard)
@UseInterceptors(TransformResponseInterceptor)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Create a new project' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Project created successfully.' })
  @ApiResponse({ status: 409, description: 'Project name already exists.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async create(
    @Req() req: Request,
    @Body() dto: CreateProjectDto,
    @UploadedFile()
    file?: { buffer: Buffer; originalname: string; mimetype: string },
  ) {
    console.log('[ProjectsController] CREATE called');
    console.log('[ProjectsController] DTO:', JSON.stringify(dto));
    console.log(
      '[ProjectsController] FILE:',
      file
        ? `${file.originalname} (${file.mimetype}, ${file.buffer.length}b)`
        : 'NONE',
    );

    const project = await this.projectsService.createProject(
      dto,
      req.user.id,
      file
        ? {
            buffer: file.buffer,
            originalname: file.originalname,
            mimetype: file.mimetype,
          }
        : undefined,
    );

    console.log(
      '[ProjectsController] CREATED:',
      JSON.stringify({
        id: project.id,
        name: project.name,
        projectImage: project.projectImage,
      }),
    );

    return { message: 'Project created successfully', project };
  }

  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Project deleted.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProject(@Param('id') id: string) {
    await this.projectsService.deleteProject(id);
    return { message: 'Project deleted successfully' };
  }

  @ApiOperation({ summary: 'Add a member to a project' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Member added.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 409, description: 'User is already a member.' })
  @Post(':id/members/:userId')
  @HttpCode(HttpStatus.OK)
  async addMember(@Param('id') id: string, @Param('userId') userId: string) {
    const project = await this.projectsService.addMember(id, userId);
    return { message: 'Member added successfully', project };
  }

  @ApiOperation({ summary: 'Remove a member from a project' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Member removed.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @Delete(':id/members/:userId')
  @HttpCode(HttpStatus.OK)
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    const project = await this.projectsService.removeMember(id, userId);
    return { message: 'Member removed successfully', project };
  }

  @ApiOperation({ summary: 'Close a project' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Project closed.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @Patch(':id/close')
  @HttpCode(HttpStatus.OK)
  async close(@Param('id') id: string) {
    const project = await this.projectsService.closeProject(id);
    return { message: 'Project closed successfully', project };
  }

  @ApiOperation({ summary: 'Reopen a project' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Project reopened.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @Patch(':id/reopen')
  @HttpCode(HttpStatus.OK)
  async reopen(@Param('id') id: string) {
    const project = await this.projectsService.reopenProject(id);
    return { message: 'Project reopened successfully', project };
  }
}
