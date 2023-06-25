import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from '../common/constants';
import { UsersRepository } from './users.providers';
import { ResultSetHeader } from 'mysql2';
import * as bcrypt from 'bcrypt';
import { CustomHttpException } from '../common/exceptions/custom-http.exception';
import { Propagation, Transactional } from 'typeorm-transactional';
import { AgreementsService } from '../agreements/agreements.service';
import { SignUpInput } from './dto/sign-up.input';

interface CreateUserParams {
  email: string;
  password: string;
  nickname: string;
}

interface CreateUserResult {
  userId: string;
  affected: number;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly agreementsService: AgreementsService,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  @Transactional({ propagation: Propagation.MANDATORY })
  async createUser(params: CreateUserParams): Promise<CreateUserResult> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(params.password, salt);

    try {
      const { raw }: { raw: ResultSetHeader } =
        await this.usersRepository.insert({
          email: params.email,
          password: hash,
          nickname: params.nickname,
        });

      return {
        userId: raw.insertId + '',
        affected: raw.affectedRows,
      };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new CustomHttpException('E_409_001', { cause: err });
      }
      throw err;
    }
  }

  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  async signUp(input: SignUpInput) {
    const { userId, affected } = await this.createUser({
      email: input.email,
      password: input.password,
      nickname: input.nickname,
    });

    await this.agreementsService.createAgreements(userId, input.policyIds);

    return affected;
  }
}
