import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  code!: string;

  @IsOptional() @IsString()
  description?: string;

  @IsNumber() @Min(0)
  discount_percent!: number;

  @IsOptional() @IsNumber() @Min(0)
  max_uses?: number;

  @IsOptional() @IsBoolean()
  is_active?: boolean;

  @IsOptional() @IsString()
  expires_at?: string;
}

export class UpdateCouponDto {
  @IsOptional() @IsString()
  code?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsNumber() @Min(0)
  discount_percent?: number;

  @IsOptional() @IsNumber() @Min(0)
  max_uses?: number;

  @IsOptional() @IsBoolean()
  is_active?: boolean;

  @IsOptional() @IsString()
  expires_at?: string;
}
