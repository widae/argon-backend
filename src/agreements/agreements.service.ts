import { Inject, Injectable } from '@nestjs/common';
import {
  AGREEMENTS_REPOSITORY,
  POLICIES_REPOSITORY,
} from '../common/constants';
import { AgreementsRepository } from './agreements.providers';
import { Propagation, Transactional } from 'typeorm-transactional';
import { PoliciesRepository } from '../policies/policies.providers';
import { CustomHttpException } from '../common/exceptions/custom-http.exception';
import { InsertResultRaw } from '../common/interfaces/insert-result-raw.interface';

@Injectable()
export class AgreementsService {
  constructor(
    @Inject(AGREEMENTS_REPOSITORY)
    private readonly agreementsRepository: AgreementsRepository,
    @Inject(POLICIES_REPOSITORY)
    private readonly policiesRepository: PoliciesRepository,
  ) {}

  @Transactional({ propagation: Propagation.MANDATORY })
  async createAgreements(userId: string, policyIds: string[]) {
    if (policyIds.length === 0) {
      throw new Error('하나 이상의 정책 아이디가 필요합니다.');
    }

    const polices = await this.policiesRepository.getByIsRequired(true);

    for (const policy of polices) {
      if (!policyIds.includes(policy.id)) {
        throw new CustomHttpException('E_422_001');
      }
    }

    const { raw }: { raw: InsertResultRaw } =
      await this.agreementsRepository.insert(
        policyIds.map((policyId) => {
          return { userId, policyId };
        }),
      );

    return raw.affectedRows;
  }
}
