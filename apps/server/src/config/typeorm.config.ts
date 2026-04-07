import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvService } from './env/env.service';

export const typeOrmConfig = TypeOrmModule.forRootAsync({
  imports: [],
  inject: [EnvService],
  useFactory: async (envService: EnvService) => ({
    type: 'postgres',
    host: envService.database.host,
    port: envService.database.port,
    username: envService.database.user,
    password: envService.database.pass,
    database: envService.database.database,
    // NOTE: this should look for entities from 
    entities: ["dist/**/*.entity.js"],
    // entities: [Link, Visit],
    synchronize: envService.isDevelopment(),
  }),
});
