import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, RequirePermissions } from '../../common/decorators/permissions.decorator';
import { ok } from '../../common/response';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get('validate/:code')
  async validate(@Param('code') code: string) {
    return ok(await this.couponsService.validate(code));
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async list() {
    return ok(await this.couponsService.list());
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async create(@Body() dto: CreateCouponDto) {
    return ok(await this.couponsService.create(dto), 'Coupon created');
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCouponDto) {
    return ok(await this.couponsService.update(id, dto), 'Coupon updated');
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.couponsService.remove(id), 'Coupon deleted');
  }
}
