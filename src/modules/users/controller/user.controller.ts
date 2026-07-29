import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/index';

import {
  Protected,
  Roles,
  UserRoles,
  RolesGuard,
  TransformResponseInterceptor,
} from '@common/index';

@ApiTags('Users')
@ApiBearerAuth()
@Controller()
@Protected()
@Roles(UserRoles.ADMIN)
@UseGuards(RolesGuard)
@UseInterceptors(TransformResponseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'List all users',
    description: 'Returns every registered user. Restricted to admins.',
  })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions.' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getUsers() {
    const users = await this.userService.findUsers();
    return {
      message: 'Users retrieved successfully',
      users,
    };
  }

  @ApiOperation({
    summary: 'Get a single user by ID',
    description: 'Fetches profile details for the given user UUID. Admin only.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the user', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'User data retrieved.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return {
      message: 'User data retrieved successfully',
      user,
    };
  }

  @ApiOperation({
    summary: 'Create a new user (admin-only)',
    description:
      'Admins can create a user with explicit roles. If no roles are supplied the `member` default is used. The password is hashed server-side.',
  })
  @ApiBody({ type: CreateUserDto, description: 'User creation payload' })
  @ApiResponse({ status: 201, description: 'User created.' })
  @ApiResponse({ status: 409, description: 'Email already registered.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.createWithRoles(
      dto.name,
      dto.email,
      dto.password,
      dto.roles,
    );
    return {
      message: 'User created successfully',
      user,
    };
  }

  @ApiOperation({
    summary: 'Delete a user',
    description: 'Permanently removes a user account. Admin only.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the user', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'User deleted.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return {
      message: 'User deleted successfully',
    };
  }

  @ApiOperation({
    summary: 'Activate a user account',
    description: 'Sets `isActive = true` for the given user. Admin only.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the user', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'User activated.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions.' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/activate')
  async activateUser(@Param('id') id: string) {
    await this.userService.activateUser(id);
    return {
      message: 'User activated successfully',
    };
  }

  @ApiOperation({
    summary: 'Deactivate a user account',
    description:
      'Sets `isActive = false` for the given user, blocking future logins. Admin only.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the user', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'User deactivated.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions.' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/deactivate')
  async deactivateUser(@Param('id') id: string) {
    await this.userService.deactivateUser(id);
    return {
      message: 'User deactivated successfully',
    };
  }
}
