import { Inject, Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { NestDataLoader } from '../common/interfaces/nest-data-loader.interface';
import { Key, SubsRepository } from './subs.providers';
import { SUBS_REPOSITORY } from '../common/constants';
import { Sub } from './sub.model';

@Injectable()
export class SubsLoader implements NestDataLoader<Key, Sub | null> {
  constructor(
    @Inject(SUBS_REPOSITORY)
    private readonly subsRepository: SubsRepository,
  ) {}

  generateDataLoader() {
    return new DataLoader(async (keys: Key[]) => {
      const subs = await this.subsRepository.getByKeyIn(keys);

      return keys.map((key) => {
        const sub = subs.find(
          (sub) =>
            key.subscriberId === sub.subscriberId &&
            key.publisherId === sub.publisherId,
        );

        return sub ? sub : null;
      });
    });
  }
}
