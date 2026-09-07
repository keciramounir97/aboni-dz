import { IsBoolean, IsEmail, IsOptional } from 'class-validator';

export class SubscribeDto {
  @IsEmail()
  email!: string;
}

export class UpdateNewsletterDto {
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
