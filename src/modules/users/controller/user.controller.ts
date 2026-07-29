import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseGuards,
  Body,
} from '@nestjs/common';
import { UserService } from '../services/user.service';

import {
  Protected,
  Roles,
  UserRoles,
  RolesGuard,
  TransformResponseInterceptor,
} from '@common/index';

import { Response } from 'express';

@Controller()
@Protected()
@Roles(UserRoles.ADMIN)
@UseGuards(RolesGuard)
@UseInterceptors(TransformResponseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  getUsers() {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUser() {}

  @HttpCode(HttpStatus.OK)
  @Post()
  create() {}

  @HttpCode(HttpStatus.OK)
  @Delete()
  @HttpCode(HttpStatus.OK)
  deleteUser() {}
  @HttpCode(HttpStatus.OK)
  @Patch()
  @HttpCode(HttpStatus.OK)
  activateUser() {}
  @HttpCode(HttpStatus.OK)
  @Patch()
  deactivateUser() {}
}
