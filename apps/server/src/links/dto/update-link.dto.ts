import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateLinkDto } from './create-link.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateLinkDto extends PartialType(OmitType(CreateLinkDto, ['url'] as const)) {
  @IsOptional()
  @IsBoolean()
  isActive: boolean
}
