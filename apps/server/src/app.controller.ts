import { Controller, ForbiddenException, Get, HttpStatus, InternalServerErrorException, NotFoundException, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { type Response, type Request } from "express"
import { TrackerService } from './tracker.service';
import { EnvService } from './config/env/env.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly trackerService: TrackerService,
    private readonly envService: EnvService,
    private readonly authService: AuthService
  ) { }

  @Get(":hash")
  async redirectToURl(
    @Param('hash') hash: string,
    @Res() res: Response,
    @Req() req: Request
  ) {


    const info = await this.authService.getDeviceInfo(req)

    console.log("Device Info:", info)

    if (!info) {
      console.log("here")
      throw new InternalServerErrorException("Something went wrong while tracking the visit.")
    }

    if (!!info?.bot) {
      throw new ForbiddenException("Bots are not allowed to access this resource.")
    }

    const link = await this.appService.getLink(hash);
    if (!link || !link.isActive) {
      // throw new NotFoundException(`Link not found.`)
      const frontEndUrl = `http://localhost:3001/notfound`
      return res.redirect(HttpStatus.TEMPORARY_REDIRECT, frontEndUrl)

    }

    await this.trackerService.trackLinkVisit(link.id, info)


    // http://localhost:3000/link?3423=312
    return res.redirect(HttpStatus.TEMPORARY_REDIRECT, link.url)
  }
}
