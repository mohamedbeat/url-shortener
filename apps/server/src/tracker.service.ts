import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Link } from "./links/entities/link.entity";
import { Repository } from "typeorm";
import { Visit } from "./links/entities/visits.entity";
import { DeviceInfo } from "./auth/auth.types";


@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Link)
    private linkRepo: Repository<Link>,
    @InjectRepository(Visit)
    private visitRepo: Repository<Visit>
  ) { }

  async trackLinkVisit(id: string, deviceInfo: DeviceInfo) {
    await this.incrementTotalCount(id)

    const visit = this.visitRepo.create({
      linkId: id,
      ...deviceInfo
    })
    const createdVisit = await this.visitRepo.save(visit)
    return createdVisit
  }

  async incrementTotalCount(id: string) {
    await this.linkRepo.increment({
      id
    }, "totalClicks", 1)
  }

}
