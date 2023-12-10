import { DataSource, DeleteResult, InsertResult, Repository } from 'typeorm';
import { DATA_SOURCE, SUBS_REPOSITORY } from '../common/constants';
import { Sub } from './sub.model';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { TakeAndSkip } from '../common/interfaces/take-and-skip.interface';

export type Key = Pick<Sub, 'subscriberId' | 'publisherId'>;

interface CustomRepository {
  insert(
    values: QueryDeepPartialEntity<Sub> | QueryDeepPartialEntity<Sub>[],
    updateEntity?: boolean,
  ): Promise<InsertResult>;
  deleteByKey(key: Key): Promise<DeleteResult>;
  getBySubscriberId(subscriberId: string, tas: TakeAndSkip): Promise<Sub[]>;
  getByPublisherId(publisherId: string, tas: TakeAndSkip): Promise<Sub[]>;
  getByKeyIn(keys: Key[]): Promise<Sub[]>;
}

export type SubsRepository = CustomRepository & Repository<Sub>;

export const subsProviders = [
  {
    inject: [DATA_SOURCE],
    useFactory: (dataSource: DataSource) => {
      const customRepository: CustomRepository & ThisType<SubsRepository> = {
        async insert(
          values: QueryDeepPartialEntity<Sub> | QueryDeepPartialEntity<Sub>[],
          updateEntity = false,
        ) {
          return await this.createQueryBuilder('sub')
            .insert()
            .values(values)
            .updateEntity(updateEntity)
            .execute();
        },
        async deleteByKey(key: Key) {
          return await this.createQueryBuilder('sub')
            .delete()
            .where(key)
            .execute();
        },
        async getBySubscriberId(subscriberId: string, tas: TakeAndSkip) {
          return await this.createQueryBuilder('user')
            .where({ subscriberId })
            .orderBy('createdAt', 'DESC')
            .take(tas.take)
            .skip(tas.skip)
            .getMany();
        },
        async getByPublisherId(publisherId: string, tas: TakeAndSkip) {
          return await this.createQueryBuilder('user')
            .where({ publisherId })
            .orderBy('createdAt', 'DESC')
            .take(tas.take)
            .skip(tas.skip)
            .getMany();
        },
        async getByKeyIn(keys: Key[]) {
          if (keys.length === 0) {
            throw new Error('배열의 길이가 0입니다.');
          }

          const qb = this.createQueryBuilder('user');

          for (const key of keys) {
            qb.orWhere(key);
          }

          return await qb.getMany();
        },
      };

      return dataSource.getRepository(Sub).extend(customRepository);
    },
    provide: SUBS_REPOSITORY,
  },
];
