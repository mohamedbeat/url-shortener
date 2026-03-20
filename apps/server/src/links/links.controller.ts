import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { PaginationDto } from '../common/dtos/paginationQuery.dto';
import { FindAllLinksFiltersDto } from './dto/find-all-filter.dto';
import { SortLinksDto } from './dto/sort-links-query.dto';
import { IdsDto } from './dto/delete-by-ids.dto';
import { User } from 'src/common/decorators/user-decorator';
@Controller('api/links')
export class LinksController {
  constructor(private readonly linksService: LinksService) { }

  @Post()
  create(@Body() createLinkDto: CreateLinkDto, @User('id') userId: string) {
    return this.linksService.create(createLinkDto, userId);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query() filter: FindAllLinksFiltersDto,
    @Query() sort: SortLinksDto,
    @User('id') userId: string
  ) {

    if (pagination.limit && pagination.limit > 100) {
      pagination.limit = 100
    }


    return this.linksService.findAll(userId, pagination.page, pagination.limit, filter, sort);
  }

  @Get("stats")
  async getStats(@User('id') userId: string) {
    return await this.linksService.getStats(userId)
  }

  @Get('checkSlug/:slug')
  checkIfSlugExists(@Param('slug') slug: string) {
    return this.linksService.checkIfSlugExists(slug);
  }


  @Get('byhash/:hash')
  findByHash(@Param('hash') hash: string) {
    return this.linksService.findByHash(hash);
  }

  @Delete('bulk-delete')
  async deleteByIds(@Body() body: IdsDto, @User('id') userId: string) {
    return await this.linksService.removeByIds(body.ids, userId)
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.linksService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLinkDto: UpdateLinkDto,
    @User('id') userId: string
  ) {
    return this.linksService.update(id, updateLinkDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') userId: string) {
    return this.linksService.remove(id, userId);
  }
}
