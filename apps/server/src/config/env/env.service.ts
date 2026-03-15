import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService) { }

  get database() {
    return {
      database: this.configService.get<string>('database.database'),
    };
  }

  get app() {
    return {
      port: this.configService.get<number>('app.port'),
      name: this.configService.get<string>('app.name'),
      environment: this.configService.get<string>('app.environment'),
    };
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
