import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinksModule } from './links/links.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [LinksModule, typeOrmConfig],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
