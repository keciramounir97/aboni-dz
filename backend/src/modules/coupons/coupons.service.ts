import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Coupon } from './coupon.model';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  async list() {
    return Coupon.query().orderBy('created_at', 'desc');
  }

  async validate(code: string) {
    const coupon = await Coupon.query().where('code', code.toUpperCase()).first();
    if (!coupon) throw new NotFoundException({ success: false, message: 'Coupon not found' });
    if (!coupon.is_active) throw new BadRequestException({ success: false, message: 'Coupon is inactive' });
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
      throw new BadRequestException({ success: false, message: 'Coupon has expired' });
    if (coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses)
      throw new BadRequestException({ success: false, message: 'Coupon usage limit reached' });
    return coupon;
  }

  async create(dto: CreateCouponDto) {
    const exists = await Coupon.query().where('code', dto.code.toUpperCase()).first();
    if (exists) throw new BadRequestException({ success: false, message: 'Code already exists' });
    return Coupon.query().insertAndFetch({
      ...dto,
      code: dto.code.toUpperCase(),
      max_uses: dto.max_uses ?? 0,
      is_active: dto.is_active ?? true,
      used_count: 0,
      expires_at: dto.expires_at || null,
    });
  }

  async update(id: number, dto: UpdateCouponDto) {
    await Coupon.query().findById(id);
    return Coupon.query().patchAndFetchById(id, { ...dto, code: dto.code ? dto.code.toUpperCase() : undefined });
  }

  async remove(id: number) {
    await Coupon.query().findById(id);
    await Coupon.query().deleteById(id);
    return { deleted: true };
  }
}
