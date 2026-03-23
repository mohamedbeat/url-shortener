import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { S3Service } from '../common/s3.service';
import { AnalyticsService } from './analytics.service';
import { Visit } from './entities/visits.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Link, Visit])],
  controllers: [LinksController],
  providers: [LinksService, S3Service, AnalyticsService],
})
export class LinksModule {
}
