import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { User, UserPermissions, UserRole } from './user.model';

@Injectable()
export class UsersService {
  async findByEmail(email: string) {
    return User.query().where('email', email.toLowerCase().trim()).first();
  }

  async findById(id: number) {
    return User.query().findById(id);
  }

  async create(data: Partial<User>) {
    return User.query().insertAndFetch(data);
  }

  async updatePassword(id: number, password_hash: string) {
    return User.query().patchAndFetchById(id, { password_hash });
  }

  async list() {
    return User.query().orderBy('created_at', 'desc');
  }

  async updateAdmin(
    id: number,
    patch: { role?: UserRole; permissions?: UserPermissions | null; is_active?: boolean },
    actor: { id: number; role: UserRole; permissions?: UserPermissions | null },
  ) {
    const target = await this.findById(id);
    if (!target) {
      throw new NotFoundException({ success: false, message: 'User not found' });
    }

    const updates: Partial<User> = {};

    if (patch.role !== undefined) {
      if (actor.role !== 'super_admin') {
        throw new ForbiddenException({
          success: false,
          message: 'Only super_admin can change roles to admin/super_admin',
        });
      }
      if (!['user', 'admin', 'super_admin'].includes(patch.role)) {
        throw new BadRequestException({ success: false, message: 'Invalid role' });
      }
      updates.role = patch.role;
    }

    if (patch.permissions !== undefined) {
      if (actor.role === 'super_admin') {
        updates.permissions = patch.permissions;
      } else if (actor.role === 'admin' && actor.permissions?.users) {
        updates.permissions = patch.permissions;
      } else {
        throw new ForbiddenException({
          success: false,
          message: 'Missing users permission',
        });
      }
    }

    if (patch.is_active !== undefined) {
      if (actor.role === 'super_admin' || (actor.role === 'admin' && actor.permissions?.users)) {
        updates.is_active = patch.is_active;
      } else {
        throw new ForbiddenException({
          success: false,
          message: 'Missing users permission',
        });
      }
    }

    if (Object.keys(updates).length === 0) {
      return target;
    }

    return User.query().patchAndFetchById(id, updates);
  }
}
