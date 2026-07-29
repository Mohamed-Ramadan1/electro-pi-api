import {
  Controller,
  Get,
  Req,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';

import {
  Protected,
  RolesGuard,
  TransformResponseInterceptor,
} from '@common/index';

import { Request } from 'express';

@Controller('members')
@Protected()
@UseGuards(RolesGuard)
@UseInterceptors(TransformResponseInterceptor)
export class MembersController {
  constructor(private readonly userService: UserService) {}
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
