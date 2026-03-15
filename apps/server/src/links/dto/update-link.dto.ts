import { PartialType } from '@nestjs/mapped-types';
import { CreateLinkDto } from './create-link.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateLinkDto extends PartialType(CreateLinkDto) {
  @IsOptional()
  @IsBoolean()
  isActive: boolean
}
