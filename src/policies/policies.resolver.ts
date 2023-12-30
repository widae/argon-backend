import { Query, Resolver } from '@nestjs/graphql';
import { Policy } from './policy.model';
import { PoliciesService } from './policies.service';

@Resolver(() => Policy)
export class PoliciesResolver {
  constructor(private readonly policiesService: PoliciesService) {}

  @Query(() => [Policy], {
    description: `
      * 기능
        - 모든 정책 읽기
      * 인증
        - 없음
    `,
  })
  async policies() {
    return await this.policiesService.getAll();
  }
}
