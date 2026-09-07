import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UploadProofDto, ReviewOrderDto } from './dto/order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ok } from '../../common/response';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@CurrentUser() user: { id: number }, @Body() dto: CreateOrderDto) {
    return ok(await this.ordersService.create(user.id, dto), 'Order created');
  }

  @Get('mine')
  async mine(@CurrentUser() user: { id: number }) {
    return ok(await this.ordersService.myOrders(user.id));
  }

  @Get('mine/:id')
  async myOne(@CurrentUser() user: { id: number }, @Param('id', ParseIntPipe) id: number) {
    return ok(await this.ordersService.myOrder(user.id, id));
  }

  @Patch('mine/:id/proof')
  async proof(
    @CurrentUser() user: { id: number },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UploadProofDto,
  ) {
    return ok(await this.ordersService.submitProof(user.id, id, dto.payment_proof_url), 'Proof submitted');
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @RequirePermissions('orders')
  async adminList(@Query('status') status?: string) {
    return ok(await this.ordersService.listAdmin(status));
  }

  @Get('admin/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @RequirePermissions('orders')
  async adminOne(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.ordersService.adminOne(id));
  }

  @Patch('admin/:id/review')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @RequirePermissions('orders')
  async review(
    @CurrentUser() user: { id: number },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReviewOrderDto,
  ) {
    return ok(await this.ordersService.review(user.id, id, dto), 'Order reviewed');
  }
}
