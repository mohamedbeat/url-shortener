import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './links/entities/link.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Link)
    private linkRepo: Repository<Link>
  ) { }

  async getLink(input: string) {

    let link = await this.linkRepo.findOneBy({
      customSlug: input
    })

    if (!!link) {
      return link
    }

    link = await this.linkRepo.findOneBy({
      shortHash: input
    })
    return link
  }
}
