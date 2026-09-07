import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, ROLES_KEY } from '../decorators/permissions.decorator';

export type AdminPermissions = {
  products?: boolean;
  orders?: boolean;
  users?: boolean;
  contacts?: boolean;
  newsletter?: boolean;
  analytics?: boolean;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException({ success: false, message: 'Forbidden' });
    }

    if (user.role === 'super_admin') {
      return true;
    }

    if (requiredRoles?.length) {
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException({ success: false, message: 'Insufficient role' });
      }
    }

    if (requiredPermissions?.length) {
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        throw new ForbiddenException({ success: false, message: 'Admin access required' });
      }
      const perms: AdminPermissions = user.permissions || {};
      const allowed = requiredPermissions.every((p) => Boolean((perms as any)[p]));
      if (!allowed) {
        throw new ForbiddenException({
          success: false,
          message: 'Missing permission',
        });
      }
    }

    return true;
  }
}
