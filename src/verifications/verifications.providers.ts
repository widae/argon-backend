import { DataSource, InsertResult, Repository, UpdateResult } from 'typeorm';
import { DATA_SOURCE, VERIFICATIONS_REPOSITORY } from '../common/constants';
import { Verification } from './verification.model';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

interface CustomRepository {
  insert(
    values:
      | QueryDeepPartialEntity<Verification>
      | QueryDeepPartialEntity<Verification>[],
    updateEntity?: boolean,
  ): Promise<InsertResult>;
  updateById(
    id: string,
    values: QueryDeepPartialEntity<Verification>,
  ): Promise<UpdateResult>;
  getByIdOrFail(id: string): Promise<Verification>;
  getByIdForUpdate(id: string): Promise<Verification | null>;
}

export type VerificationsRepository = CustomRepository &
  Repository<Verification>;

export const verificationsProviders = [
  {
    inject: [DATA_SOURCE],
    useFactory: (dataSource: DataSource) => {
      const customRepository: CustomRepository &
        ThisType<VerificationsRepository> = {
        async insert(
          values:
            | QueryDeepPartialEntity<Verification>
            | QueryDeepPartialEntity<Verification>[],
          updateEntity = false,
        ) {
          return await this.createQueryBuilder('verification')
            .insert()
            .values(values)
            .updateEntity(updateEntity)
            .execute();
        },
        async updateById(
          id: string,
          values: QueryDeepPartialEntity<Verification>,
        ) {
          return await this.createQueryBuilder('verification')
            .update()
            .set(values)
            .where({ id })
            .execute();
        },
        async getByIdOrFail(id: string) {
          return await this.createQueryBuilder('verification')
            .where({ id })
            .getOneOrFail();
        },
        async getByIdForUpdate(id: string) {
          return await this.createQueryBuilder('verification')
            .where({ id })
            .setLock('pessimistic_write')
            .getOne();
        },
      };

      return dataSource.getRepository(Verification).extend(customRepository);
    },
    provide: VERIFICATIONS_REPOSITORY,
  },
];
