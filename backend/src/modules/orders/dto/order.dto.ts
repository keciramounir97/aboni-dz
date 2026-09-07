import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsInt() @Min(1) product_id!: number;
  @IsOptional() @IsInt() @Min(1) quantity?: number;
}

export class UploadProofDto {
  @IsString() @MaxLength(500) payment_proof_url!: string;
}

class DeliveryAccountDto {
  @IsOptional() @IsString() username?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() password?: string;
  @IsOptional() @IsString() extra?: string;
}

export class ReviewOrderDto {
  @IsEnum(['approved', 'rejected', 'delivered'])
  status!: 'approved' | 'rejected' | 'delivered';

  @IsOptional() @IsString() admin_note?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DeliveryAccountDto)
  delivery_account?: DeliveryAccountDto;
}
