import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { PaginationDto } from '../common/dtos/paginationQuery.dto';
import { FindAllLinksFiltersDto } from './dto/find-all-filter.dto';

@Controller('api/links')
export class LinksController {
  constructor(private readonly linksService: LinksService) { }

  @Post()
  create(@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(createLinkDto);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query() filter: FindAllLinksFiltersDto
  ) {

    if (pagination.limit && pagination.limit > 100) {
      pagination.limit = 100
    }

    return this.linksService.findAll(pagination.page, pagination.limit, filter);
  }

  @Get('byhash/:hash')
  findByHash(@Param('hash') hash: string) {
    return this.linksService.findByHash(hash);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.linksService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(id, updateLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linksService.remove(id);
  }
}
