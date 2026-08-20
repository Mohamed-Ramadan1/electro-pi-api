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

import {
  Protected,
  Roles,
  RolesGuard,
  TransformResponseInterceptor,
  UserRoles,
  CurrentUser,
  AuthenticatedUser,
} from '@common/index';

@Controller('events')
export class EventsController {}
