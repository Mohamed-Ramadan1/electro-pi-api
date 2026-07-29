import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TokenService } from '@infrastructure/index';

import { IS_PROTECTED_KEY } from '../decorators/protected.decorator';
import { UserService } from '@modules/users/services/user.service';
import { forwardRef, Inject } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly tokenService: TokenService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const protectedRequest = this.isProtected(context);

    /*
     * check if its have the protected metadata or not
     * if not then return true to allow the request to pass through with not the user validation step
     * if it has the protected metadata then the if statement will be false and the request will be passed to the next step which is the user validation step.
     */
    if (!protectedRequest) return true;

    const req: Request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.tokenService.verifyAccessToken(token);

      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // attach user to request so downstream handlers/decorators can access it
      req['user'] = user;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  protected isProtected(context: ExecutionContext): boolean {
    return !!this.reflector.getAllAndOverride<boolean>(IS_PROTECTED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
