import { DataSource, Repository } from 'typeorm';
import { DATA_SOURCE, SCHOOLS_REPOSITORY } from '../common/constants';
import { School } from './school.model';

interface CustomRepository {
  search(keyword: string): Promise<School[]>;
}

export type SchoolsRepository = CustomRepository & Repository<School>;

export const schoolsProviders = [
  {
    inject: [DATA_SOURCE],
    useFactory: (dataSource: DataSource) => {
      const customRepository: CustomRepository & ThisType<SchoolsRepository> = {
        async search(keyword: string) {
          return await this.createQueryBuilder('school')
            .where(`MATCH(name) AGAINST ('${keyword}' IN BOOLEAN MODE)`)
            .getMany();
        },
      };

      return dataSource.getRepository(School).extend(customRepository);
    },
    provide: SCHOOLS_REPOSITORY,
  },
];
