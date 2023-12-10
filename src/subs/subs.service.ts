import { Inject, Injectable } from '@nestjs/common';
import { SUBS_REPOSITORY } from '../common/constants';
import { CustomHttpException } from '../common/exceptions/custom-http.exception';
import { InsertResultRaw } from '../common/interfaces/insert-result-raw.interface';
import { Key, SubsRepository } from './subs.providers';
import { Propagation, Transactional } from 'typeorm-transactional';
import { UsersService } from '../users/users.service';
import { Sub } from './sub.model';
import { TakeAndSkip } from '../common/interfaces/take-and-skip.interface';

type CreateValues = Pick<Sub, 'subscriberId' | 'publisherId'>;

@Injectable()
export class SubsService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(SUBS_REPOSITORY)
    private readonly subsRepository: SubsRepository,
  ) {}

  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  async create(values: CreateValues) {
    if (values.subscriberId === values.publisherId) {
      throw new CustomHttpException('E_422_003');
    }

    try {
      const { raw }: { raw: InsertResultRaw } =
        await this.subsRepository.insert(values);

      await this.usersService.onSubscribeOrCancel(
        'SUBSCRIBE',
        values.subscriberId,
        values.publisherId,
      );

      return raw.affectedRows;
    } catch (err) {
      if (err?.code === 'ER_DUP_ENTRY') {
        throw new CustomHttpException('E_409_002', { cause: err });
      }
      throw err;
    }
  }

  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  async delete(key: Key) {
    const { affected } = (await this.subsRepository.deleteByKey(key)) as {
      affected: number;
    };

    if (affected === 1) {
      await this.usersService.onSubscribeOrCancel(
        'CANCEL',
        key.subscriberId,
        key.publisherId,
      );
    }

    return affected;
  }

  async getBySubscriberId(subscriberId: string, tas: TakeAndSkip) {
    return await this.subsRepository.getBySubscriberId(subscriberId, tas);
  }

  async getByPublisherId(publisherId: string, tas: TakeAndSkip) {
    return await this.subsRepository.getByPublisherId(publisherId, tas);
  }
}
