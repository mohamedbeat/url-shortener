import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinksModule } from './links/links.module';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config'
import {
  envConfig,
  envValidatinSchema
} from './config/env/env.config';
import { EnvModule } from './config/env/env.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './links/entities/link.entity';
import { TrackerService } from './tracker.service';
import { Visit } from './links/entities/visits.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [envConfig],
    validationSchema: envValidatinSchema,
    validationOptions: {
      // Return all validation errors, not just the first one
      abortEarly: true,
    }
  }),
    EnvModule,
    LinksModule,
    typeOrmConfig,
  TypeOrmModule.forFeature([Link, Visit]),
    AuthModule,



  ],
  controllers: [AppController],
  providers: [AppService,
    TrackerService,
  ],
})
export class AppModule {
}
