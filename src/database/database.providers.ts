import { ConfigService } from '@nestjs/config';
import { DATA_SOURCE } from '../common/constants';
import { DataSource } from 'typeorm';
import { EnvVars } from '../env.validation';
import { addTransactionalDataSource } from 'typeorm-transactional';

export const databaseProviders = [
  {
    inject: [ConfigService],
    useFactory: async (configService: ConfigService<EnvVars, true>) => {
      const host = configService.get('MYSQL_HOST', { infer: true });
      const port = configService.get('MYSQL_PORT', { infer: true });
      const username = configService.get('MYSQL_USER', { infer: true });
      const password = configService.get('MYSQL_PASSWORD', { infer: true });
      const database = configService.get('MYSQL_SCHEMA', { infer: true });

      const dataSource = new DataSource({
        type: 'mysql',
        host,
        port,
        username,
        password,
        database,
        entities: [__dirname + '/../**/*.model{.ts,.js}'],
        timezone: 'Z',
        logging: false,
        synchronize: false,
      });

      addTransactionalDataSource(dataSource);

      return dataSource.initialize();
    },
    provide: DATA_SOURCE,
  },
];
