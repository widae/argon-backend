import { Inject, Injectable } from '@nestjs/common';
import { POLICIES_REPOSITORY } from '../common/constants';
import { PoliciesRepository } from './policies.providers';

@Injectable()
export class PoliciesService {
  constructor(
    @Inject(POLICIES_REPOSITORY)
    private readonly policiesRepository: PoliciesRepository,
  ) {}

  async getAll() {
    return await this.policiesRepository.getAll();
  }
}
