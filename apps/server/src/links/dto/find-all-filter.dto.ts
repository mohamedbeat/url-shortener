import { IsOptional, IsString } from 'class-validator';

export class FindAllLinksFiltersDto {

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  shortHash?: string;

  @IsOptional()
  @IsString()
  customSlug?: string;

}
