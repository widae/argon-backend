import { Inject, Injectable } from '@nestjs/common';
import { COMPANIES_REPOSITORY } from '../common/constants';
import { CompaniesRepository } from './companies.providers';
import { TakeAndSkip } from '../common/interfaces/take-and-skip.interface';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject(COMPANIES_REPOSITORY)
    private readonly companiesRepository: CompaniesRepository,
  ) {}

  async getByNameContaining(name: string, tas: TakeAndSkip) {
    const pattern = `%${name}%`;
    return await this.companiesRepository.getByNameLike(pattern, tas);
  }
}
