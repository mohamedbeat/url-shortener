import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService) { }

  get database() {
    return {
      database: this.configService.getOrThrow<string>('database.database'),
      host: this.configService.getOrThrow<string>('database.host'),
      port: this.configService.getOrThrow<number>('database.port'),
      user: this.configService.getOrThrow<string>('database.user'),
      pass: this.configService.getOrThrow<string>('database.pass'),
    };
  }

  get app() {
    return {
      port: this.configService.getOrThrow<number>('app.port'),
      name: this.configService.getOrThrow<string>('app.name'),
      environment: this.configService.getOrThrow<string>('app.environment'),
      frontEndUrl: this.configService.getOrThrow<string>('app.frontEndUrl'),
    };
  }

  get auth() {
    return {
      jwtSecret: this.configService.getOrThrow<string>('auth.jwtSecret'),
      jwtExpiresIn: this.configService.getOrThrow<number>('auth.jwtExpiresIn'),
      googleClientId: this.configService.getOrThrow<string>('auth.googleClientId'),
      googleClientSecret: this.configService.getOrThrow<string>('auth.googleClientSecret'),
    }
  }

  // get jwt() {
  //   return {
  //     secret: this.configService.get<string>('jwt.secret'),
  //     expiresIn: this.configService.get<string>('jwt.expiresIn'),
  //   };
  // }

  isDevelopment(): boolean {
    return this.app.environment === 'development';
  }

  isProduction(): boolean {
    return this.app.environment === 'production';
  }

  isStaging(): boolean {

    return this.app.environment === 'staging';
  }
}
