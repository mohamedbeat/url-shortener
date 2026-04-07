import { Controller, ForbiddenException, Get, HttpStatus, InternalServerErrorException, NotFoundException, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { type Response, type Request } from "express"
import { TrackerService } from './tracker.service';
import { EnvService } from './config/env/env.service';
import { AuthService } from './auth/auth.service';
import { Public } from './common/decorators/public.decorator';

@Public()
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


    if (!info) {
      throw new InternalServerErrorException("Something went wrong while tracking the visit.")
    }

    if (!!info?.bot) {
      throw new ForbiddenException("Bots are not allowed to access this resource.")
    }

    const link = await this.appService.getLink(hash);
    console.log("link", link)
    if (!link || !link.isActive || link.isExpired) {
      // throw new NotFoundException(`Link not found.`)
      const frontEndUrl = this.envService.app.frontEndUrl + `/notfound`
      return res.redirect(HttpStatus.TEMPORARY_REDIRECT, frontEndUrl)

    }

    await this.trackerService.trackLinkVisit(link.id, info)


    return res.redirect(HttpStatus.TEMPORARY_REDIRECT, link.url)
  }
}
