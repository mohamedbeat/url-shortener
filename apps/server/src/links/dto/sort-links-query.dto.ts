import { type LinkSortFields, type SortOrder } from "@packages/shared/types";
import { IsIn, IsOptional } from "class-validator";



export class SortLinksDto {
    @IsOptional()
    @IsIn(['createdAt', 'totalClicks', 'title', 'updatedAt'])
    field?: LinkSortFields = 'createdAt';

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order?: SortOrder = 'DESC';
}