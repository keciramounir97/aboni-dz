import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, RequirePermissions } from '../../common/decorators/permissions.decorator';
import { ok } from '../../common/response';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @RequirePermissions('analytics')
  async overview() {
    return ok(await this.analyticsService.overview());
  }

  @Get('sales-by-status')
  @RequirePermissions('analytics')
  async salesByStatus() {
    return ok(await this.analyticsService.salesByStatus());
  }

  @Get('sales-by-category')
  @RequirePermissions('analytics')
  async salesByCategory() {
    return ok(await this.analyticsService.salesByCategory());
  }

  @Get('recent-orders')
  @RequirePermissions('analytics')
  async recentOrders(@Query('limit') limit?: string) {
    return ok(await this.analyticsService.recentOrders(limit ? Number(limit) : 10));
  }

  @Get('top-products')
  @RequirePermissions('analytics')
  async topProducts(@Query('limit') limit?: string) {
    return ok(await this.analyticsService.topProducts(limit ? Number(limit) : 5));
  }

  @Get('user-growth')
  @RequirePermissions('analytics')
  async userGrowth() {
    return ok(await this.analyticsService.userGrowth());
  }

  @Get('daily-revenue')
  @RequirePermissions('analytics')
  async dailyRevenue(@Query('days') days?: string) {
    return ok(await this.analyticsService.dailyRevenue(days ? Number(days) : 30));
  }
}
