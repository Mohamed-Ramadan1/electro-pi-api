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

@Controller('events')
export class EventsController {}
