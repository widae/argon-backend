import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.providers';
import * as DataLoader from 'dataloader';
import { NestDataLoader } from '../common/interfaces/nest-data-loader.interface';
import { User } from './user.model';
import { USERS_REPOSITORY } from '../common/constants';

@Injectable()
export class UsersLoader implements NestDataLoader<string, User | null> {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
  ) {}

  generateDataLoader() {
    return new DataLoader(async (ids: string[]) => {
      const users = await this.usersRepository.getByIdIn(ids);

      return ids.map((id) => {
        const user = users.find((user) => id === user.id);
        return user ? user : null;
      });
    });
  }
}
