import { Args, Query, Resolver } from '@nestjs/graphql';
import { School } from './school.model';
import { SchoolsService } from './schools.service';
import { SearchSchoolsInput } from './dto/search-schools.input';

@Resolver(() => School)
export class SchoolsResolver {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Query(() => [School])
  async searchForSchools(@Args('input') input: SearchSchoolsInput) {
    return await this.schoolsService.search(input.keyword);
  }
}
