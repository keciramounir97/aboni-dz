import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ok } from '../../common/response';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  async listForProduct(@Param('productId', ParseIntPipe) productId: number) {
    return ok(await this.reviewsService.listForProduct(productId));
  }

  @Get('product/:productId/stats')
  async stats(@Param('productId', ParseIntPipe) productId: number) {
    return ok(await this.reviewsService.averageRating(productId));
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async adminList() {
    return ok(await this.reviewsService.listAll());
  }

  @Patch('admin/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async approve(@Param('id', ParseIntPipe) id: number, @Body() body: { is_approved: boolean }) {
    return ok(await this.reviewsService.setApproved(id, body.is_approved), 'Review updated');
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.reviewsService.remove(id), 'Review deleted');
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  async mine(@CurrentUser() user: { id: number }) {
    return ok(await this.reviewsService.myReviews(user.id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: { id: number; name: string }, @Body() dto: CreateReviewDto) {
    return ok(await this.reviewsService.create(user.id, user.name, dto), 'Review submitted');
  }
}
