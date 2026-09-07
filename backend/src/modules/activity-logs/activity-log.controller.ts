import { Controller, Get, Query, UseGuards, ParseIntPipe, Param } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ok } from '../../common/response';

@Controller('activity-logs')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @RequirePermissions('analytics')
  async adminList(@Query('action') action?: string, @Query('entity') entity?: string, @Query('limit') limit?: string) {
    return ok(await this.activityLogService.list({
      action,
      entity,
      limit: limit ? Number(limit) : 200,
    }));
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @RequirePermissions('analytics')
  async stats() {
    return ok(await this.activityLogService.countByAction());
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  async mine(@CurrentUser() user: { id: number }) {
    return ok(await this.activityLogService.listForUser(user.id));
  }
}
