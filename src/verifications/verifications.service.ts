import { Inject, Injectable } from '@nestjs/common';
import { VERIFICATIONS_REPOSITORY } from '../common/constants';
import { VerificationsRepository } from './verifications.providers';
import { genNumCode } from '../common/utils/gen-num-code.util';
import * as bcrypt from 'bcrypt';
import { VerificationType } from './enums/verification-type.enum';
import { InsertResultRaw } from '../common/interfaces/insert-result-raw.interface';
import { EmailsService } from '../emails/emails.service';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from '../env.validation';
import { Propagation, Transactional } from 'typeorm-transactional';
import { CustomHttpException } from '../common/exceptions/custom-http.exception';

@Injectable()
export class VerificationsService {
  private readonly templateId: string;

  constructor(
    private readonly configService: ConfigService<EnvVars, true>,
    private readonly emailsService: EmailsService,
    @Inject(VERIFICATIONS_REPOSITORY)
    private readonly verificationsRepository: VerificationsRepository,
  ) {
    this.templateId = this.configService.get('EMAIL_VERIFICATION_TEMPLATE_ID', {
      infer: true,
    });
  }

  async createEmailVerification(email: string) {
    const code = genNumCode(6);
    const hash = await bcrypt.hash(code, 10);
    const expireAt = new Date();
    expireAt.setMinutes(expireAt.getMinutes() + 3);

    const { raw }: { raw: InsertResultRaw } =
      await this.verificationsRepository.insert({
        type: VerificationType.EMAIL,
        key: email,
        code: hash,
        isVerified: false,
        expireAt,
      });

    const verification = await this.verificationsRepository.getByIdOrFail(
      raw.insertId + '',
    );

    await this.emailsService.sendUsingTemplate(
      [verification.key],
      this.templateId,
      JSON.stringify({ code }),
    );

    return verification;
  }

  @Transactional({ propagation: Propagation.MANDATORY })
  async verify(id: string, code: string) {
    const verification = await this.verificationsRepository.getByIdForUpdate(
      id,
    );

    if (!verification || verification.isVerified) {
      throw new CustomHttpException('E_422_002');
    }

    const isEqual = await bcrypt.compare(code, verification.code);

    if (!isEqual) {
      throw new CustomHttpException('E_422_002');
    }

    const curTime = new Date().getTime();
    const expireTime = verification.expireAt.getTime();

    if (expireTime < curTime) {
      throw new CustomHttpException('E_422_002');
    }

    await this.verificationsRepository.updateById(verification.id, {
      isVerified: true,
    });
  }
}
