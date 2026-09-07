import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, RequirePermissions } from '../../common/decorators/permissions.decorator';
import { ok } from '../../common/response';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async list(@Query('category') category?: string, @Query('q') q?: string) {
    return ok(await this.productsService.listPublic(category, q));
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @RequirePermissions('products')
  async adminList() {
    return ok(await this.productsService.listAdmin());
  }

  @Get('slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return ok(await this.productsService.findBySlug(slug));
  }

  @Get(':id')
  async byId(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.productsService.findById(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @RequirePermissions('products')
  async create(@Body() dto: CreateProductDto) {
    return ok(await this.productsService.create(dto), 'Product created');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @RequirePermissions('products')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return ok(await this.productsService.update(id, dto), 'Product updated');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @RequirePermissions('products')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.productsService.remove(id), 'Product deleted');
  }
}
