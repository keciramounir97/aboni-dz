import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Review } from './review.model';
import { Product } from '../products/product.model';
import { CreateReviewDto } from './dto/review.dto';
import { ActivityLogService } from '../activity-logs/activity-log.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly activityLogs: ActivityLogService) {}

  async listForProduct(productId: number) {
    return Review.query()
      .where({ product_id: productId, is_approved: true })
      .withGraphFetched('user')
      .orderBy('created_at', 'desc');
  }

  async listAll() {
    return Review.query().withGraphFetched('[product,user]').orderBy('created_at', 'desc');
  }

  async averageRating(productId: number) {
    const result = await Review.query()
      .where({ product_id: productId, is_approved: true })
      .avg('rating as avg')
      .count('id as total')
      .first() as any;
    return { average: Number(result?.avg || 0), count: Number(result?.total || 0) };
  }

  async create(userId: number, userName: string, dto: CreateReviewDto) {
    const product = await Product.query().findById(dto.product_id);
    if (!product) throw new NotFoundException({ success: false, message: 'Product not found' });

    const existing = await Review.query().where({ user_id: userId, product_id: dto.product_id }).first();
    if (existing) throw new BadRequestException({ success: false, message: 'You already reviewed this product' });

    const review = await Review.query().insertAndFetch({
      user_id: userId,
      product_id: dto.product_id,
      rating: dto.rating,
      comment: dto.comment || null,
      is_approved: false,
    });
    await this.activityLogs.log(userId, userName, 'review_created', 'review', review.id, { product_id: dto.product_id, rating: dto.rating });
    return review;
  }

  async setApproved(id: number, isApproved: boolean) {
    await Review.query().findById(id);
    return Review.query().patchAndFetchById(id, { is_approved: isApproved });
  }

  async remove(id: number) {
    await Review.query().findById(id);
    await Review.query().deleteById(id);
    return { deleted: true };
  }

  async myReviews(userId: number) {
    return Review.query().where({ user_id: userId }).withGraphFetched('product').orderBy('created_at', 'desc');
  }
}
