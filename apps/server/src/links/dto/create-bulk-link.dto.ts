import { IsString, IsUrl, IsOptional, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { PickType } from '@nestjs/mapped-types';
import { CreateLinkDto } from './create-link.dto';
// import { ApiProperty } from '@nestjs/swagger'; // Optional: for Swagger documentation

export class CreateBulkLinksDto {
    //   @ApiProperty({ description: 'Array of links to create', type: [CreateLinkDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PickType(CreateLinkDto, ['url'] as const))
    @IsNotEmpty({ message: 'Links array cannot be empty' })
    links: Pick<CreateLinkDto, 'url'>[];
}