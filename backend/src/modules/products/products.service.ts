import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Product } from './product.model';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  async listPublic(category?: string, q?: string) {
    let query = Product.query().where('is_active', true).orderBy('created_at', 'desc');
    if (category) query = query.where('category', category);
    if (q) {
      const like = `%${q}%`;
      query = query.andWhere((builder) => {
        builder
          .where('name_en', 'like', like)
          .orWhere('name_fr', 'like', like)
          .orWhere('name_ar', 'like', like)
          .orWhere('slug', 'like', like);
      });
    }
    return query;
  }

  async listAdmin() {
    return Product.query().orderBy('created_at', 'desc');
  }

  async findBySlug(slug: string) {
    const product = await Product.query().where({ slug, is_active: true }).first();
    if (!product) throw new NotFoundException({ success: false, message: 'Product not found' });
    return product;
  }

  async findById(id: number) {
    const product = await Product.query().findById(id);
    if (!product) throw new NotFoundException({ success: false, message: 'Product not found' });
    return product;
  }

  async create(dto: CreateProductDto) {
    const exists = await Product.query().where('slug', dto.slug).first();
    if (exists) throw new BadRequestException({ success: false, message: 'Slug already exists' });
    return Product.query().insertAndFetch({
      ...dto,
      currency: dto.currency || 'DZD',
      is_active: dto.is_active ?? true,
      stock: dto.stock ?? 999,
      description_en: dto.description_en ?? null,
      description_fr: dto.description_fr ?? null,
      description_ar: dto.description_ar ?? null,
      logo_url: dto.logo_url ?? null,
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findById(id);
    if (dto.slug) {
      const clash = await Product.query().where('slug', dto.slug).whereNot('id', id).first();
      if (clash) throw new BadRequestException({ success: false, message: 'Slug already exists' });
    }
    return Product.query().patchAndFetchById(id, dto);
  }

  async remove(id: number) {
    await this.findById(id);
    await Product.query().deleteById(id);
    return { deleted: true };
  }
}
