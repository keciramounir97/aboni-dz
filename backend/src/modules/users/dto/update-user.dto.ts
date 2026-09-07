import { IsBoolean, IsEnum, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PermissionsDto {
  @IsOptional() @IsBoolean() products?: boolean;
  @IsOptional() @IsBoolean() orders?: boolean;
  @IsOptional() @IsBoolean() users?: boolean;
  @IsOptional() @IsBoolean() contacts?: boolean;
  @IsOptional() @IsBoolean() newsletter?: boolean;
  @IsOptional() @IsBoolean() analytics?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEnum(['user', 'admin', 'super_admin'])
  role?: 'user' | 'admin' | 'super_admin';

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PermissionsDto)
  permissions?: PermissionsDto | null;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
