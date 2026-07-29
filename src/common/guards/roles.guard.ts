import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../constants/roles.constants';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedUser } from '@common/interfaces/authenticated-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const cls = context.getClass();

    console.log('--- RolesGuard Debug ---');
    console.log('handler metadata keys:', Reflect.getMetadataKeys(handler));
    console.log('class metadata keys:', Reflect.getMetadataKeys(cls));
    console.log(
      'handler roles metadata:',
      Reflect.getMetadata(ROLES_KEY, handler),
    );
    console.log('class roles metadata:', Reflect.getMetadata(ROLES_KEY, cls));

    const requiredRoles = this.reflector.getAllAndMerge<UserRole[]>(ROLES_KEY, [
      handler,
      cls,
    ]);

    // no @Roles() decorator present -> route isn't role-restricted, allow
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const user = context.switchToHttp().getRequest().user as
      AuthenticatedUser | undefined;

    console.log('user in RolesGuard:', user);
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
