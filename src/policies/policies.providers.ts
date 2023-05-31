import { DataSource, Repository } from 'typeorm';
import { Policy } from './policy.model';
import { DATA_SOURCE, POLICIES_REPOSITORY } from '../common/constants';

export interface PoliciesRepository {
  getAll(): Promise<Policy[]>;
}

export const policiesProviders = [
  {
    inject: [DATA_SOURCE],
    useFactory: (dataSource: DataSource) => {
      const repo: PoliciesRepository &
        ThisType<Repository<Policy> & PoliciesRepository> = {
        async getAll() {
          return await this.createQueryBuilder('policy').getMany();
        },
      };

      return dataSource.getRepository(Policy).extend(repo);
    },
    provide: POLICIES_REPOSITORY,
  },
];
