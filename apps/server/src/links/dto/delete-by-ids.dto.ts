import { IsArray, IsString, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class IdsDto {
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    ids: string[];
}