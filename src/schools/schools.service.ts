import { Inject, Injectable } from '@nestjs/common';
import { SCHOOLS_REPOSITORY } from '../common/constants';
import { SchoolsRepository } from './schools.providers';

@Injectable()
export class SchoolsService {
  constructor(
    @Inject(SCHOOLS_REPOSITORY)
    private readonly schoolsRepository: SchoolsRepository,
  ) {}

  async search(keyword: string) {
    return await this.schoolsRepository.search(keyword);
  }
}
