import { ConfigService } from '@nestjs/config';
import { DATA_SOURCE } from '../common/constants';
import { DataSource } from 'typeorm';
import { EnvVars } from '../env.validation';

export const databaseProviders = [
  {
    inject: [ConfigService],
    useFactory: async (configService: ConfigService<EnvVars, true>) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get('MYSQL_HOST', { infer: true }),
        port: configService.get('MYSQL_PORT', { infer: true }),
        username: configService.get('MYSQL_USER', { infer: true }),
        password: configService.get('MYSQL_PASSWORD', { infer: true }),
        database: configService.get('MYSQL_SCHEMA', { infer: true }),
        entities: [__dirname + '/../**/*.model{.ts,.js}'],
        timezone: 'Z',
        logging: false,
        synchronize: false,
      });

      return dataSource.initialize();
    },
    provide: DATA_SOURCE,
  },
];
