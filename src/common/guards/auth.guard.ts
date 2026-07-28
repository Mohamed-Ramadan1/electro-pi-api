import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';

import { IS_PROTECTED_KEY } from '../decorators/protected.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const protectedRequest = this.isProtected(context);

    /*
     * check if its have the protected metadata or not
     * if not then return true to allow the request to pass through with not the user validation step
     * if it has the protected metadata then the if statement will be false and the request will be passed to the next step which is the user validation step.
     */
    if (!protectedRequest) return true;

    // const user: AuthenticatedUser = context.switchToHttp().getRequest<Request>()
    //   .user as AuthenticatedUser;

    // console.log('user from auth guard', user);

    return true;
  }

  protected isProtected(context: ExecutionContext): boolean {
    return !!this.reflector.getAllAndOverride<boolean>(IS_PROTECTED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
