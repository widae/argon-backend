import { Query, Resolver } from '@nestjs/graphql';
import { Policy } from './policy.model';
import { PoliciesService } from './policies.service';

@Resolver(() => Policy)
export class PoliciesResolver {
  constructor(private readonly policiesService: PoliciesService) {}

  @Query(() => [Policy])
  async policies() {
    return await this.policiesService.getAll();
  }
}
