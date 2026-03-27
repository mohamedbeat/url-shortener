import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { In, LessThan, MoreThan, Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { LinkSortFields, SortOrder, type Pagination } from "@packages/shared/types"
import { S3Service } from '../common/s3.service';
import { FindAllLinksFiltersDto } from './dto/find-all-filter.dto';
import { CreateBulkLinksDto } from './dto/create-bulk-link.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LinksService {

  constructor(
    @InjectRepository(Link)
    private linkRepo: Repository<Link>,
    private s3Serice: S3Service
  ) { }

  async create(createLinkDto: CreateLinkDto, userId: string) {
    const urlExist = await this.exists(createLinkDto.url, userId)
    if (!!urlExist) {
      throw new ConflictException("the given URL already exists")
    }
    if (!!createLinkDto.customSlug) {
      const slugExist = await this.linkRepo.findOne({
        where: [
          { customSlug: createLinkDto.customSlug },
          { shortHash: createLinkDto.customSlug },
        ]
      })

      if (!!slugExist) {
        throw new ConflictException("the given custom slug already exists")
      }
    }

    const domain = this.getDomainFromURL(createLinkDto.url)

    let publicURL: string | undefined = undefined

    // check if we have a domain
    if (domain?.length !== 0) {

      // get icon publicURL from s3
      publicURL = await this.s3Serice.getIconPublicURL(domain)

      // check if icon publicURL doesnt exists to upload the icon
      if (!publicURL) {
        const icon = await this.s3Serice.FetchFavicon(createLinkDto.url, 64)
        if (icon?.buffer) {
          publicURL = await this.s3Serice.uploadIcon(domain, icon.buffer, icon.size)
        }
      }
    }

    const hash = await this.generateUniqueHash()

    const created = this.linkRepo.create({
      ...createLinkDto,
      shortHash: hash,
      userId,
      publicURL
    })
    return await this.linkRepo.save(created);
  }

  async createBulk(data: CreateBulkLinksDto, userId: string) {
    const links = data.links.map((l) => l.url)
    const found = await this.linkRepo.find({
      where: {
        url: In(links),
        userId: userId
      }
    })

    if (found.length > 0) {
      throw new ConflictException({
        message: 'some urls already exist',
        urls: found
      })
    }

    let created = await this.linkRepo.create(data.links)
    created = await Promise.all(created.map(async l => {
      const hash = await this.generateUniqueHash()
      l.shortHash = hash
      l.userId = userId
      return l
    }))

    await this.linkRepo.save(created)
    return created
  }

  async exists(url: string, userId: string) {
    const found = await this.linkRepo.findOne({
      where: [
        { url: url, userId: userId },
      ]
    })

    return !!found
  }

  async findAll(

    userId: string,
    page: number = 1,
    limit: number = 10,
    filters?: FindAllLinksFiltersDto,
    sort?: {
      field?: LinkSortFields
      order?: SortOrder
    },
  ): Promise<Pagination<Link>> {

    const queryBuilder = this.linkRepo.createQueryBuilder('link');

    queryBuilder.andWhere('link.userId = :userId', { userId });
    // Apply filters if provided
    if (filters?.search) {
      queryBuilder.andWhere(
        `(link.title LIKE :search 
        OR link.url LIKE :search 
        OR link.shortHash LIKE :search 
        OR link.customSlug LIKE :search)`,
        { search: `%${filters.search}%` },
      );
    }

    if (filters?.status && filters.status !== 'all') {
      queryBuilder.andWhere('link.isActive = :isActive', {
        isActive: filters.status === 'active',
      });
    }

    // Get total count before pagination
    const total = await queryBuilder.getCount();

    // Apply sorting
    if (sort) {
      queryBuilder.orderBy(`link.${sort.field}`, sort.order);
    } else {
      // Default sorting
      queryBuilder.orderBy('link.createdAt', 'DESC');
    }

    // Apply pagination and ordering
    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data,
      pagination: {
        currentPage: page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async findById(id: string) {
    const found = await this.linkRepo.findOneBy({
      id: id
    })
    if (!found) {
      throw new NotFoundException(`Link with id ${id} not found`)
    }
    return found
  }

  async findByHash(hash: string) {
    const found = await this.linkRepo.findOneBy({
      shortHash: hash
    })
    if (!found) {
      throw new NotFoundException(`Link with hash ${hash} not found`)
    }
    return found
  }

  async update(id: string, updateLinkDto: UpdateLinkDto, userId: string) {

    const found = await this.findById(id)
    if (found.userId !== userId) {
      throw new ForbiddenException()
    }

    if (!!updateLinkDto.customSlug) {
      const slugExist = await this.linkRepo.findOne({
        where: [
          { customSlug: updateLinkDto.customSlug },
          { shortHash: updateLinkDto.customSlug },
        ]
      })
      if (!!slugExist) {
        throw new ConflictException(`the given custom slug already exist.`)
      }
    }

    await this.linkRepo.update({
      id
    }, {
      ...updateLinkDto
    })
    return this.linkRepo.findOneBy({
      id
    })
  }

  async remove(id: string, userId: string) {

    const found = await this.findById(id)
    if (found.userId !== userId) {
      throw new ForbiddenException()
    }

    await this.linkRepo.delete({
      id
    })

    return {
      message: "deleted successfully"
    }
  }

  async removeByIds(ids: string[], userId: string) {
    await this.linkRepo.delete({
      id: In(ids),
      userId: userId
    })
  }

  async generateUniqueHash(length: number = 8): Promise<string> {
    const maxAttempts = 5;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const hash = nanoid(length);
      const existing = await this.linkRepo.findOneBy({ shortHash: hash });

      if (!existing) {
        return hash;
      }

      attempts++;
    }
    // If we couldn't find a unique hash after max attempts, increase length
    return this.generateUniqueHash(length + 1);
  }

  getDomainFromURL(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;

    return domain

  }

  async checkIfSlugExists(slug: string) {
    const found = await this.linkRepo.findOneBy({
      customSlug: slug
    })

    if (!found) {
      return {
        available: true
      }
    }
    return {
      available: false
    }
  }


  async getStats(userId: string) {
    // throw new InternalServerErrorException()
    const totalLinks = await this.linkRepo.countBy({
      userId
    })

    //i want to calcute total clicks 
    const totalClicks = await this.linkRepo.sum('totalClicks', {
      userId
    })

    return {
      totalLinks,
      totalClicks: totalClicks || 0
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async markExpiredLinks() {
    console.log('EXPIRY CRON JOB')
    const now = new Date();

    // Direct bulk update - no fetching needed
    const result = await this.linkRepo
      .createQueryBuilder()
      .update(Link)
      .set({ isExpired: true })
      .where('expiresAt IS NOT NULL')
      .andWhere('expiresAt <= :now', { now })
      .andWhere('isExpired = :isExpired', { isExpired: false })
      .execute();

    if (result.affected && result.affected > 0) {
      console.log(`[${new Date().toISOString()}] Marked ${result.affected} links as expired`);
    }
  }

  // Cron job to delete expired links 
  @Cron(CronExpression.EVERY_10_SECONDS)
  async deleteExpiredLinks() {
    console.log('DELETE CRON JOB RUNNING');

    // Calculate the date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Delete links that:
    // 1. Are marked as expired
    // 2. Expired at least 7 days ago
    const result = await this.linkRepo
      .createQueryBuilder()
      .delete()
      .from(Link)
      .where('isExpired = :isExpired', { isExpired: true })
      .andWhere('expiresAt <= :threshold', { threshold: sevenDaysAgo })
      .execute();

    if (result.affected && result.affected > 0) {
      console.log(`[${new Date().toISOString()}] Deleted ${result.affected} links that expired more than 7 days ago`);
    } else {
      console.log(`[${new Date().toISOString()}] No links to delete`);
    }
  }
}
