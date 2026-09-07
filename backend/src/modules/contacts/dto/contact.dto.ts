import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsString() @MinLength(2) @MaxLength(255) name!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(2) @MaxLength(255) subject!: string;
  @IsString() @MinLength(5) message!: string;
}

export class UpdateContactStatusDto {
  @IsEnum(['new', 'read', 'replied'])
  status!: 'new' | 'read' | 'replied';
}
