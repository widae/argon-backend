import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from '../common/constants';
import { UsersRepository } from './users.providers';
import { ResultSetHeader } from 'mysql2';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { CustomHttpException } from '../common/exceptions/custom-http.exception';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async createUser(input: CreateUserInput) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(input.password, salt);

    try {
      const { raw }: { raw: ResultSetHeader } =
        await this.usersRepository.insert({
          email: input.email,
          password: hash,
          nickname: input.nickname,
        });

      return raw.affectedRows;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new CustomHttpException('E_409_001', { cause: err });
      }
      throw err;
    }
  }
}
