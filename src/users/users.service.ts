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
import { SignUpWithGoogleInput } from './dto/sign-up-with-google.input';
import { GoogleOauth2Service } from '../google-oauth2/google-oauth2.service';
import { jwtDecode } from 'jwt-decode';
import { User } from './user.model';
import { LogInType } from './enums/log-in-type.enum';
import { GoogleIdTokenPayload } from '../google-oauth2/interfaces/google-id-token-payload.interface';
import { BufferUpload } from '../files/interfaces/buffer-upload.interface';
import { FilesService } from '../files/files.service';
import { v4 as uuidv4 } from 'uuid';
import { UpdateMyselfValues } from './types/update-myself-values.type';

type CreateUserValues = Pick<
  User,
  'email' | 'logInType' | 'password' | 'nickname'
>;

interface CreateUserResult {
  userId: string;
}

type CreateUserAndAgreementsParams = CreateUserValues & {
  policyIds: string[];
};

interface CreateUserAndAgreementsResult {
  userId: string;
}

interface SignUpResult {
  userId: string;
}

interface SignUpWithGoogleResult {
  userId: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly agreementsService: AgreementsService,
    private readonly verificationsService: VerificationsService,
    private readonly googleOauth2Service: GoogleOauth2Service,
    private readonly filesService: FilesService,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  @Transactional({ propagation: Propagation.MANDATORY })
  async createUser(values: CreateUserValues): Promise<CreateUserResult> {
    let hash: string | null = null;

    if (values.logInType === LogInType.EMAIL_PASSWORD) {
      if (values.password === null) {
        throw new Error('비밀번호가 문자열이 아닙니다.');
      }

      const salt = await bcrypt.genSalt();
      hash = await bcrypt.hash(values.password, salt);
    }

    try {
      const { raw }: { raw: InsertResultRaw } =
        await this.usersRepository.insert({
          email: values.email,
          logInType: values.logInType,
          password: hash,
          nickname: values.nickname,
        });

      return { userId: raw.insertId.toString() };
    } catch (err) {
      if (err?.code === 'ER_DUP_ENTRY') {
        throw new CustomHttpException('E_409_001', { cause: err });
      }
      throw err;
    }
  }

  @Transactional({ propagation: Propagation.REQUIRED })
  async createUserAndAgreements(
    params: CreateUserAndAgreementsParams,
  ): Promise<CreateUserAndAgreementsResult> {
    const { userId } = await this.createUser({
      email: params.email,
      logInType: params.logInType,
      password: params.password,
      nickname: params.nickname,
    });

    await this.agreementsService.createAgreements(userId, params.policyIds);

    return { userId };
  }

  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  async signUp(input: SignUpInput): Promise<SignUpResult> {
    await this.verificationsService.verify(
      input.verificationId,
      input.verificationCode,
    );

    const { userId } = await this.createUserAndAgreements({
      email: input.email,
      logInType: LogInType.EMAIL_PASSWORD,
      password: input.password,
      nickname: input.nickname,
      policyIds: input.policyIds,
    });

    return { userId };
  }

  async signUpWithGoogle(
    input: SignUpWithGoogleInput,
  ): Promise<SignUpWithGoogleResult> {
    const { id_token: idToken } = await this.googleOauth2Service.getTokens(
      input.code,
    );

    if (idToken == null) {
      throw new Error('ID 토큰 값이 문자열이 아닙니다.');
    }

    const { email } = jwtDecode<GoogleIdTokenPayload>(idToken);

    const { userId } = await this.createUserAndAgreements({
      email,
      logInType: LogInType.GOOGLE,
      password: null,
      nickname: input.nickname,
      policyIds: input.policyIds,
    });

    return { userId };
  }

  /**
   * 사용자 자신에 대한 수정
   *
   * 참고: -1을 반환할 수 없음
   *
   * @param id 사용자 ID
   * @param values 사용자 자신에 대한 수정을 위한 값들
   * @return 수정된 개체 수의 프라미스
   */
  async updateMyself(id: string, values: UpdateMyselfValues) {
    const { affected } = await this.usersRepository.updateById(id, values);
    return affected ?? -1;
  }

  /**
   * 사용자 이미지 업로드
   *
   * @param id 사용자 ID
   * @param upload 버퍼 업로드 객체
   * @return 사용자 이미지 URL 프라미스
   */
  async uploadUserImage(id: string, upload: BufferUpload) {
    /* 파일 생성 */
    const key = uuidv4();

    await this.filesService.createFile(key, upload);

    /* 사용자 수정 (이미지명 설정) */
    await this.usersRepository.updateById(id, { imageName: key });

    /* 반환 */
    return await this.filesService.keyToUrl(key);
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

  /**
   * 특정 ID의 사용자 읽기
   *
   * @param id 사용자 ID
   * @returns 특정 ID의 사용자 개체 또는 널 프라미스
   */
  async getById(id: string) {
    return await this.usersRepository.getById(id);
  }
}
