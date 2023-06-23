import { DataSource, Repository } from 'typeorm';
import { Policy } from './policy.model';
import { DATA_SOURCE, POLICIES_REPOSITORY } from '../common/constants';

interface CustomRepository {
  getAll(): Promise<Policy[]>;
}

export type PoliciesRepository = CustomRepository & Repository<Policy>;

export const policiesProviders = [
  {
    inject: [DATA_SOURCE],
    useFactory: (dataSource: DataSource) => {
      const customRepository: CustomRepository & ThisType<PoliciesRepository> =
        {
          async getAll() {
            return await this.createQueryBuilder('policy').getMany();
          },
        };

      return dataSource.getRepository(Policy).extend(customRepository);
    },
    provide: POLICIES_REPOSITORY,
  },
];
