import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Response, Request } from 'express';
import { User } from './entities/user.entity';
import { EnvService } from 'src/config/env/env.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly envService: EnvService) { }



  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // This is handled by Passport.js - it redirects the user to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // req.user is populated by our GoogleStrategy's validate() method
    console.log(req.user)
    const tokens = await this.authService.login(req.user as User, req);


    const frontendUrl = `http://localhost:5173/login-success?token=${tokens.accessToken}`;

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
    // res.redirect(frontendUrl)
    return tokens
  }

  @Post('refreshTokens')
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const accessToken = req.cookies['accessToken']
    const refreshToken = req.cookies['refreshToken']
    return await this.authService.refreshTokens(refreshToken, accessToken)
  }
}
