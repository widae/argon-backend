import { DataSource, InsertResult, Repository } from 'typeorm';
import { AGREEMENTS_REPOSITORY, DATA_SOURCE } from '../common/constants';
import { Agreement } from './agreement.model';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

interface CustomRepository {
  insert(
    values:
      | QueryDeepPartialEntity<Agreement>
      | QueryDeepPartialEntity<Agreement>[],
    updateEntity?: boolean,
  ): Promise<InsertResult>;
}

export type AgreementsRepository = CustomRepository & Repository<Agreement>;

export const agreementsProviders = [
  {
    inject: [DATA_SOURCE],
    useFactory: (dataSource: DataSource) => {
      const customRepository: CustomRepository &
        ThisType<AgreementsRepository> = {
        async insert(
          values:
            | QueryDeepPartialEntity<Agreement>
            | QueryDeepPartialEntity<Agreement>[],
          updateEntity = false,
        ) {
          return await this.createQueryBuilder('agreement')
            .insert()
            .values(values)
            .updateEntity(updateEntity)
            .execute();
        },
      };

      return dataSource.getRepository(Agreement).extend(customRepository);
    },
    provide: AGREEMENTS_REPOSITORY,
  },
];
