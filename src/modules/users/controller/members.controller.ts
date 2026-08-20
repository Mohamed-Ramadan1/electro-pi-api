import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';

import {
  Protected,
  RolesGuard,
  TransformResponseInterceptor,
  CurrentUser,
  AuthenticatedUser,
} from '@common/index';

@ApiTags('Members')
@ApiBearerAuth()
@Controller('members')
@Protected()
@UseGuards(RolesGuard)
@UseInterceptors(TransformResponseInterceptor)
export class MembersController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({
    summary: 'Get the currently authenticated user',
    description:
      'Returns the profile (name, email, roles) of the user identified by the access token. Requires a valid bearer token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    const freshUser = await this.userService.findById(user.id);
    return {
      message: 'success retrieval the user  ',
      user: {
        name: freshUser?.name,
        email: freshUser?.email,
        roles: freshUser?.roles,
      },
    };
  }
}
