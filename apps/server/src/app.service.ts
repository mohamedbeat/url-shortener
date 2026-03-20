import { Injectable } from '@nestjs/common';
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
    const linkBySlug = await this.linkRepo.findOneBy({
      customSlug: input
    })

    if (linkBySlug) {
      return linkBySlug
    }

    return this.linkRepo.findOneBy({
      shortHash: input
    })
  }
}
