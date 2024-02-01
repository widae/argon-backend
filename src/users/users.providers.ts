import { DataSource, InsertResult, Repository, UpdateResult } from 'typeorm';
import { DATA_SOURCE, USERS_REPOSITORY } from '../common/constants';
import { User } from './user.model';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { cleanObj } from '../common/utils/clean-obj.util';

interface CustomRepository {
  insert(
    values: QueryDeepPartialEntity<User> | QueryDeepPartialEntity<User>[],
    updateEntity?: boolean,
  ): Promise<InsertResult>;
  updateById(
    id: string,
    values: QueryDeepPartialEntity<User>,
  ): Promise<UpdateResult>;
  /**
   * 특정 ID의 사용자 읽기
   *
   * @param id 사용자 ID
   * @returns 특정 ID의 사용자 개체 또는 널 프라미스
   */
  getById(id: string): Promise<User | null>;
  getByIdForUpdate(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getByIdIn(ids: string[]): Promise<User[]>;
}

export type UsersRepository = CustomRepository & Repository<User>;

export const usersProviders = [
  {
    inject: [DATA_SOURCE],
    useFactory: (dataSource: DataSource) => {
      const customRepository: CustomRepository & ThisType<UsersRepository> = {
        async insert(
          values: QueryDeepPartialEntity<User> | QueryDeepPartialEntity<User>[],
          updateEntity = false,
        ) {
          return await this.createQueryBuilder('user')
            .insert()
            .values(values)
            .updateEntity(updateEntity)
            .execute();
        },
        async updateById(id: string, values: QueryDeepPartialEntity<User>) {
          return await this.createQueryBuilder('user')
            .update()
            .set(cleanObj(values))
            .where({ id })
            .execute();
        },
        async getById(id: string) {
          return await this.createQueryBuilder('user').where({ id }).getOne();
        },
        async getByIdForUpdate(id: string) {
          return await this.createQueryBuilder('user')
            .where({ id })
            .setLock('pessimistic_write')
            .getOne();
        },
        async getByEmail(email: string) {
          return await this.createQueryBuilder('user')
            .where({ email })
            .getOne();
        },
        async getByIdIn(ids: string[]) {
          if (ids.length === 0) {
            throw new Error('배열의 길이가 0입니다.');
          }

          return await this.createQueryBuilder('user')
            .where('id IN (:...ids)', { ids })
            .getMany();
        },
      };

      return dataSource.getRepository(User).extend(customRepository);
    },
    provide: USERS_REPOSITORY,
  },
];
