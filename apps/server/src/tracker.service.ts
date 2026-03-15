import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Link } from "./links/entities/link.entity";
import { Repository } from "typeorm";



@Injectable()
export class TrackerService {

  constructor(
    @InjectRepository(Link)
    private linkRepo: Repository<Link>
  ) { }

  async handleClick(id: string) {
    await this.linkRepo.increment({
      id
    }, "totalClicks", 1)
  }

}
