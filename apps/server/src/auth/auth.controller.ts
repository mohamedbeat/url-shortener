import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard as PassPortAuthGuard } from '@nestjs/passport';
import type { Response, Request } from 'express';
import { User } from './entities/user.entity';
import { EnvService } from 'src/config/env/env.service';
import { User as UserDecorator } from '../common/decorators/user-decorator'
import { Public } from 'src/common/decorators/public.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly envService: EnvService) { }


  @Get('me')
  async me(@UserDecorator('id') userId: string) {
    const user = await this.authService.getUserById(userId)
    return this.authService.getSafeUserInfo(user)
  }

  @Get('google')
  @Public()
  @UseGuards(PassPortAuthGuard('google'))
  async googleAuth(@Req() req) {
    // This is handled by Passport.js - it redirects the user to Google
  }

  @Get('google/callback')
  @Public()
  @UseGuards(PassPortAuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // req.user is populated by our GoogleStrategy's validate() method
    const tokens = await this.authService.login(req.user as User, req);

    // IMPORTANT:
    // Cookies are sent based on the browser's origin (frontend host) vs the backend host.
    // Hardcoding localhost here can break cookie sending if your frontend/API run on different hosts.
    const frontendBaseUrl = (process.env.FRONTEND_URL ?? 'http://localhost:3001').replace(/\/$/, '')
    console.log("frontend base url", frontendBaseUrl)
    const frontendUrl = `${frontendBaseUrl}/login/success`;

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: this.envService.isProduction(),
      sameSite: 'lax',
      maxAge: 3600000 * 24, // 1 hour
    })
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.envService.isProduction(),
      sameSite: 'lax',
      maxAge: 3600000 * 24, // 1 hour
    })
    return res.redirect(frontendUrl)
    // return 
  }

  @Post('refreshTokens')
  @Public()
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const accessToken = req.cookies['accessToken']
    const refreshToken = req.cookies['refreshToken']
    console.log(accessToken)
    return await this.authService.refreshTokens(refreshToken, accessToken)
  }
}
