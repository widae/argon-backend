import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from '../common/constants';
import { UsersRepository } from './users.providers';
import * as bcrypt from 'bcrypt';
import { CustomHttpException } from '../common/exceptions/custom-http.exception';
import { Propagation, Transactional } from 'typeorm-transactional';
import { AgreementsService } from '../agreements/agreements.service';
import { SignUpInput } from './dto/sign-up.input';
import { InsertResultRaw } from '../common/interfaces/insert-result-raw.interface';
import { VerificationsService } from '../verifications/verifications.service';

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
    private readonly verificationsService: VerificationsService,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  @Transactional({ propagation: Propagation.MANDATORY })
  async createUser(params: CreateUserParams): Promise<CreateUserResult> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(params.password, salt);

    try {
      const { raw }: { raw: InsertResultRaw } =
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
      if (err?.code === 'ER_DUP_ENTRY') {
        throw new CustomHttpException('E_409_001', { cause: err });
      }
      throw err;
    }
  }

  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  async signUp(input: SignUpInput) {
    await this.verificationsService.verify(
      input.verificationId,
      input.verificationCode,
    );

    const { userId, affected } = await this.createUser({
      email: input.email,
      password: input.password,
      nickname: input.nickname,
    });

    await this.agreementsService.createAgreements(userId, input.policyIds);

    return affected;
  }

  @Transactional({ propagation: Propagation.MANDATORY })
  async onSubscribeOrCancel(
    type: 'SUBSCRIBE' | 'CANCEL',
    subscriberId: string,
    publisherId: string,
  ) {
    /* 구독 수 변경 */
    const subscriber = await this.usersRepository.getByIdForUpdate(
      subscriberId,
    );

    if (!subscriber) {
      throw new CustomHttpException('E_404_001');
    }

    const nextNumSubs =
      type === 'SUBSCRIBE' ? subscriber.numSubs + 1 : subscriber.numSubs - 1;

    await this.usersRepository.updateById(subscriber.id, {
      numSubs: nextNumSubs,
    });

    /* 구독자 수 변경 */
    const publisher = await this.usersRepository.getByIdForUpdate(publisherId);

    if (!publisher) {
      throw new CustomHttpException('E_404_002');
    }

    const nextNumSubscribers =
      type === 'SUBSCRIBE'
        ? publisher.numSubscribers + 1
        : publisher.numSubscribers - 1;

    await this.usersRepository.updateById(publisher.id, {
      numSubscribers: nextNumSubscribers,
    });
  }
}
