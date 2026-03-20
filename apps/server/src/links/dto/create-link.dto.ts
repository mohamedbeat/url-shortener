import {
  IsString,
  IsUrl,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateLinkDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(255, { message: 'Title cannot exceed 255 characters' })
  title?: string;

  @IsUrl({}, { message: 'Please provide a valid URL' })
  @IsNotEmpty()
  @MaxLength(2048, { message: 'URL is too long' })
  url: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'custom slug must be at least 3 characters long' })
  @MaxLength(255, { message: 'custom slug cannot exceed 255 characters' })
  customSlug: string
}
