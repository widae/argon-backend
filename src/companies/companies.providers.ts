import { DataSource, Repository } from 'typeorm';
import { DATA_SOURCE, COMPANIES_REPOSITORY } from '../common/constants';
import { Company } from './company.model';
import { TakeAndSkip } from '../common/interfaces/take-and-skip.interface';

interface CustomRepository {
  getByNameLike(pattern: string, tas: TakeAndSkip): Promise<Company[]>;
}

export type CompaniesRepository = CustomRepository & Repository<Company>;

export const companiesProviders = [
  {
    inject: [DATA_SOURCE],
    useFactory: (dataSource: DataSource) => {
      const customRepository: CustomRepository & ThisType<CompaniesRepository> =
        {
          async getByNameLike(pattern: string, tas: TakeAndSkip) {
            return await this.createQueryBuilder('company')
              .where('name LIKE :pattern', { pattern })
              .take(tas.take)
              .skip(tas.skip)
              .getMany();
          },
        };

      return dataSource.getRepository(Company).extend(customRepository);
    },
    provide: COMPANIES_REPOSITORY,
  },
];
