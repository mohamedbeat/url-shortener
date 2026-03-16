import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { type Pagination } from "@packages/shared/types"
import { S3Service } from '../common/s3.service';

@Injectable()
export class LinksService {

  constructor(
    @InjectRepository(Link)
    private linkRepo: Repository<Link>,
    private s3Serice: S3Service
  ) { }

  async create(createLinkDto: CreateLinkDto) {
    const urlExist = await this.exists(createLinkDto.url)
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
      publicURL
    })
    return await this.linkRepo.save(created);
  }

  async exists(url: string) {
    const found = await this.linkRepo.findOne({
      where: [
        { url: url },
      ]
    })

    return !!found
  }


  async getByShortHash(hash: string) {
    return await this.linkRepo.findOneBy({
      shortHash: hash
    })
  }

  async getByURL(url: string) {
    return await this.linkRepo.findOneBy({
      url: url
    })
  }

  async getBySlug(slug: string) {
    return await this.linkRepo.findOneBy({
      customSlug: slug
    })
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      title?: string;
      url?: string;
      shortHash?: string;
      customSlug?: string
    },
  ): Promise<Pagination<Link>> {
    const queryBuilder = this.linkRepo.createQueryBuilder('link');

    // Apply filters if provided
    if (filters?.title) {
      queryBuilder.andWhere('link.title LIKE :title', { title: `%${filters.title}%` });
    }

    if (filters?.url) {
      queryBuilder.andWhere('link.url GLOB :url', { url: `*${filters.url}*` });
    }

    if (filters?.customSlug) {
      queryBuilder.andWhere('link.customSlug LIKE :customSlug', { customSlug: `%${filters.customSlug}%` });
    }

    if (filters?.shortHash) {
      queryBuilder.andWhere('link.shortHash GLOB :shortHash', {
        shortHash: `*${filters.shortHash}*`
      });
    }

    // Get total count before pagination
    const total = await queryBuilder.getCount();

    // Apply pagination and ordering
    const data = await queryBuilder
      .orderBy('link.createdAt', 'DESC')
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

  async update(id: string, updateLinkDto: UpdateLinkDto) {

    await this.findById(id)

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

  async remove(id: string) {

    await this.findById(id)

    await this.linkRepo.delete({
      id
    })

    return {
      message: "deleted successfully"
    }
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


}
