import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '../links/entities/link.entity';
import { EnvModule } from './env/env.module';
import { EnvService } from './env/env.service';

export const typeOrmConfig = TypeOrmModule.forRootAsync({
  imports: [],
  inject: [EnvService],
  useFactory: async (envService: EnvService) => ({
    type: 'sqlite',
    database: envService.database.database,
    entities: [Link],
    synchronize: envService.isDevelopment(),
  }),
});
