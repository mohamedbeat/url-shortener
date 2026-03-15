import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Link } from "./links/entities/link.entity";
import { Repository } from "typeorm";
import { type Request } from "express"
import DeviceDetector from 'device-detector-js';
import { Visit } from "./links/entities/visits.entity";

export type DeviceInfo = {
  browser?: string;
  os?: string;
  deviceType?: string; // 'desktop', 'smartphone', 'tablet'
  isMobile?: boolean;
  bot?: boolean;
  referer?: string
}

@Injectable()
export class TrackerService {

  private deviceDetector = new DeviceDetector();


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

  async getDeviceInfo(req: Request): Promise<DeviceInfo | undefined> {
    const userAgent = req.headers['user-agent'];
    console.log("user agent", userAgent)
    const referer = req.headers.referer;

    const info: Partial<DeviceInfo> = {};

    if (userAgent) {
      const deviceInfo = this.deviceDetector.parse(userAgent);

      Object.assign(info, {
        browser: deviceInfo.client?.name,
        os: deviceInfo.os?.name,
        deviceType: deviceInfo.device?.type,
        isMobile: deviceInfo.device?.type === 'smartphone',
        bot: !!deviceInfo.bot
      });
    }

    if (referer) {
      info.referer = referer;
    }

    // Check if any property has a truthy value
    const hasAnyData = Object.values(info).some(value => value !== undefined);

    return hasAnyData ? info as DeviceInfo : undefined;
  }

}
