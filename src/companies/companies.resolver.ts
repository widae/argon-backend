import { Args, Query, Resolver } from '@nestjs/graphql';
import { Company } from './company.model';
import { CompaniesService } from './companies.service';
import { GetCompaniesByNameContainingArgs } from './dto/get-companies-by-name-containing.args';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Query(() => [Company])
  async companiesWithNameContaining(
    @Args() args: GetCompaniesByNameContainingArgs,
  ) {
    return await this.companiesService.getByNameContaining(args.name, {
      take: args.take,
      skip: args.skip,
    });
  }
}
