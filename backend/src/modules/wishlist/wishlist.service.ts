import { Injectable, NotFoundException } from '@nestjs/common';
import { Wishlist } from './wishlist.model';
import { Product } from '../products/product.model';

@Injectable()
export class WishlistService {
  async mine(userId: number) {
    return Wishlist.query().where('user_id', userId).withGraphFetched('product').orderBy('created_at', 'desc');
  }

  async isWishlisted(userId: number, productId: number) {
    const item = await Wishlist.query().where({ user_id: userId, product_id: productId }).first();
    return !!item;
  }

  async add(userId: number, productId: number) {
    const product = await Product.query().findById(productId);
    if (!product) throw new NotFoundException({ success: false, message: 'Product not found' });
    const existing = await Wishlist.query().where({ user_id: userId, product_id: productId }).first();
    if (existing) return { id: existing.id, already: true };
    const entry = await Wishlist.query().insertAndFetch({ user_id: userId, product_id: productId });
    return entry;
  }

  async remove(userId: number, productId: number) {
    await Wishlist.query().where({ user_id: userId, product_id: productId }).delete();
    return { removed: true };
  }

  async removeById(userId: number, id: number) {
    await Wishlist.query().where({ user_id: userId, id }).delete();
    return { removed: true };
  }
}
