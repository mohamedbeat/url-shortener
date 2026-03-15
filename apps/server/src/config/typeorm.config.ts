import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from 'src/links/entities/link.entity';

export const typeOrmConfig = TypeOrmModule.forRootAsync({
  imports: [],
  inject: [],
  useFactory: async () => ({
    type: 'sqlite',
    database: 'db.db',
    entities: [Link],
    synchronize: true,
  }),
});
