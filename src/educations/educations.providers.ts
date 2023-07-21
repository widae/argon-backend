import {
  DataSource,
  DeleteResult,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Education } from './education.model';
import { DATA_SOURCE, EDUCATIONS_REPOSITORY } from '../common/constants';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Orders } from '../common/interfaces/orders.interface';

interface CustomRepository {
  insert(
    value:
      | QueryDeepPartialEntity<Education>
      | QueryDeepPartialEntity<Education>[],
    updateEntity?: boolean,
  ): Promise<InsertResult>;
  getAllByUserId(id: string): Promise<Education[]>;
  updateTheOrderFromBelow(
    userId: string,
    orders: Orders,
  ): Promise<UpdateResult>;
  updateTheOrderFromAbove(
    userId: string,
    orders: Orders,
  ): Promise<UpdateResult>;
  updateTheOrder(
    userId: string,
    id: string,
    order: number,
  ): Promise<UpdateResult>;
  update(
    educationId: string,
    values: QueryDeepPartialEntity<Education>,
  ): Promise<UpdateResult>;
  delete(educationId: string): Promise<DeleteResult>;
}

export type EducationsRepository = CustomRepository & Repository<Education>;

export const educationsProviders = [
  {
    inject: [DATA_SOURCE],
    useFactory: (dataSource: DataSource) => {
      const customRepository: CustomRepository &
        ThisType<EducationsRepository> = {
        async insert(value, updateEntity = false) {
          return await this.createQueryBuilder('education')
            .insert()
            .values(value)
            .updateEntity(updateEntity)
            .execute();
        },
        async getAllByUserId(userId: string) {
          return await this.createQueryBuilder('education')
            .where({ userId })
            .orderBy('education.order')
            .getMany();
        },
        async updateTheOrderFromBelow(userId: string, orders: Orders) {
          return await this.createQueryBuilder('education')
            .update()
            .set({ order: () => 'order - 1' })
            .where({ userId })
            .andWhere('order > :lastOrder AND order <= :order', {
              lastOrder: orders.lastOrder,
              order: orders.order,
            })
            .execute();
        },
        async updateTheOrderFromAbove(userId: string, orders: Orders) {
          return await this.createQueryBuilder('education')
            .update()
            .set({ order: () => 'order + 1' })
            .where({ userId })
            .andWhere('order < :lastOrder AND order >= :order', {
              lastOrder: orders.lastOrder,
              order: orders.order,
            })
            .execute();
        },
        async updateTheOrder(userId: string, id: string, order: number) {
          return await this.createQueryBuilder('education')
            .update()
            .set({ order: order })
            .where({ id, userId })
            .execute();
        },
        async update(id: string, values: QueryDeepPartialEntity<Education>) {
          return await this.createQueryBuilder('education')
            .update()
            .set(values)
            .where({ id })
            .execute();
        },
        async delete(id: string) {
          return await this.createQueryBuilder('education')
            .delete()
            .where({ id })
            .execute();
        },
      };

      return dataSource.getRepository(Education).extend(customRepository);
    },
    provide: EDUCATIONS_REPOSITORY,
  },
];
