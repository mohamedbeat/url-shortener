import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { EnvService } from 'src/config/env/env.service';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly envService: EnvService, private readonly authService: AuthService) {
        super({
            clientID: envService.auth.googleClientId,
            clientSecret: envService.auth.googleClientSecret,
            scope: ['email', 'profile'],
            callbackURL: 'http://localhost:3000/api/auth/google/callback',
        })
        // super({
        //     clientID: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        //     callbackURL: 'http://localhost:3000/auth/google/callback',
        //     scope: ['email', 'profile'],
        // });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
        const { id, name, emails, photos } = profile;

        const user = await this.authService.validateGoogleUser({
            googleId: id,
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
        });

        done(null, user);
    }
}