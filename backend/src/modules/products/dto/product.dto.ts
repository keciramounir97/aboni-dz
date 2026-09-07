import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

const CATEGORIES = [
  'spotify',
  'netflix',
  'playstation',
  'xbox',
  'snapchat',
  'disney',
  'youtube',
  'other',
] as const;

export class CreateProductDto {
  @IsString() @MinLength(2) @MaxLength(255) slug!: string;
  @IsString() @MinLength(2) @MaxLength(255) name_en!: string;
  @IsString() @MinLength(2) @MaxLength(255) name_fr!: string;
  @IsString() @MinLength(2) @MaxLength(255) name_ar!: string;
  @IsOptional() @IsString() description_en?: string;
  @IsOptional() @IsString() description_fr?: string;
  @IsOptional() @IsString() description_ar?: string;
  @IsOptional() @IsString() @MaxLength(500) logo_url?: string;
  @IsEnum(CATEGORIES) category!: (typeof CATEGORIES)[number];
  @IsNumber() @Min(0) price!: number;
  @IsOptional() @IsString() @MaxLength(10) currency?: string;
  @IsInt() @Min(1) duration_days!: number;
  @IsOptional() @IsBoolean() is_active?: boolean;
  @IsOptional() @IsInt() @Min(0) stock?: number;
}

export class UpdateProductDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(255) slug?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(255) name_en?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(255) name_fr?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(255) name_ar?: string;
  @IsOptional() @IsString() description_en?: string;
  @IsOptional() @IsString() description_fr?: string;
  @IsOptional() @IsString() description_ar?: string;
  @IsOptional() @IsString() @MaxLength(500) logo_url?: string | null;
  @IsOptional() @IsEnum(CATEGORIES) category?: (typeof CATEGORIES)[number];
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsString() @MaxLength(10) currency?: string;
  @IsOptional() @IsInt() @Min(1) duration_days?: number;
  @IsOptional() @IsBoolean() is_active?: boolean;
  @IsOptional() @IsInt() @Min(0) stock?: number;
}
