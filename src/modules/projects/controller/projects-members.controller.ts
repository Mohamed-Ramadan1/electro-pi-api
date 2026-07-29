import {
  Controller,
  Get,
  Req,
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

import { ProjectsService } from '../services/projects.service';
import { Request } from 'express';

@ApiTags('Projects - Members')
@ApiBearerAuth()
@Controller('members')
@Protected()
@UseGuards(RolesGuard)
@UseInterceptors(TransformResponseInterceptor)
export class ProjectsMembersController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({
    summary: 'List my projects',
    description:
      'Returns every project where the authenticated user is the creator or a member.',
  })
  @ApiResponse({ status: 200, description: 'Projects retrieved.' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const projects = await this.projectsService.findAll(req.user.id);
    return { message: 'Projects retrieved successfully', projects };
  }

  @ApiOperation({
    summary: 'Get a single project',
    description:
      'Returns a project by ID, only if the authenticated user is the creator or a member.',
  })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Project retrieved.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const project = await this.projectsService.findOne(id, req.user.id);
    return { message: 'Project retrieved successfully', project };
  }
}
