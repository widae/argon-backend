import { DataSource, InsertResult, Repository } from 'typeorm';
import { DATA_SOURCE, USERS_REPOSITORY } from '../common/constants';
import { User } from './user.model';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

interface CustomRepository {
  insert(
    values: QueryDeepPartialEntity<User> | QueryDeepPartialEntity<User>[],
    updateEntity?: boolean,
  ): Promise<InsertResult>;
  getByEmail(email: string): Promise<User | null>;
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
        async getByEmail(email: string) {
          return await this.createQueryBuilder('user')
            .where({ email })
            .getOne();
        },
      };

      return dataSource.getRepository(User).extend(customRepository);
    },
    provide: USERS_REPOSITORY,
  },
];
