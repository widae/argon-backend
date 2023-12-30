import { Args, Query, Resolver } from '@nestjs/graphql';
import { Company } from './company.model';
import { CompaniesService } from './companies.service';
import { GetCompaniesByNameContainingArgs } from './dto/get-companies-by-name-containing.args';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Query(() => [Company], {
    description: `
      * 기능
        - 특정 문자열이 포함된 이름의 회사 리스트 읽기
      * 인증
        - 없음
    `,
  })
  async companiesWithNameContaining(
    @Args() args: GetCompaniesByNameContainingArgs,
  ) {
    return await this.companiesService.getByNameContaining(args.name, {
      take: args.take,
      skip: args.skip,
    });
  }
}
