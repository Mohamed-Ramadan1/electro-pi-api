import {
  Controller,
  Get,
  Req,
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
} from '@common/index';

import { Request } from 'express';

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
  async getMe(@Req() req: Request) {
    const user = await this.userService.findById(req.user.id);
    return {
      message: 'success retrieval the user  ',
      user: {
        name: user?.name,
        email: user?.email,
        roles: user?.roles,
      },
    };
  }
}
