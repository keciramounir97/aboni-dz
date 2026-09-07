import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ok } from '../../common/response';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get('mine')
  async mine(@CurrentUser() user: { id: number }) {
    return ok(await this.wishlistService.mine(user.id));
  }

  @Post()
  async add(@CurrentUser() user: { id: number }, @Body() body: { product_id: number }) {
    return ok(await this.wishlistService.add(user.id, body.product_id), 'Added to wishlist');
  }

  @Delete(':productId')
  async remove(@CurrentUser() user: { id: number }, @Param('productId', ParseIntPipe) productId: number) {
    return ok(await this.wishlistService.remove(user.id, productId), 'Removed from wishlist');
  }

  @Delete('item/:id')
  async removeById(@CurrentUser() user: { id: number }, @Param('id', ParseIntPipe) id: number) {
    return ok(await this.wishlistService.removeById(user.id, id), 'Removed from wishlist');
  }

  @Get('check/:productId')
  async check(@CurrentUser() user: { id: number }, @Param('productId', ParseIntPipe) productId: number) {
    return ok({ wished: await this.wishlistService.isWishlisted(user.id, productId) });
  }
}
