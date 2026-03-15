import { Controller, Get, HttpStatus, NotFoundException, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { type Response } from "express"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get(":hash")
  async redirectToURl(
    @Param('hash') hash: string,
    @Res() res: Response
  ) {
    const link = await this.appService.getLink(hash);
    if (!link || !link.isActive) {
      throw new NotFoundException(`Link not found.`)
    }
    return res.redirect(HttpStatus.MOVED_PERMANENTLY, link.url)
  }
}
