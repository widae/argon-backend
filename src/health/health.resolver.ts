import { Query, Resolver } from '@nestjs/graphql';
import { Health } from './health.model';
import { HealthService } from './health.service';

@Resolver(() => Health)
export class HealthResolver {
  constructor(private readonly healthService: HealthService) {}

  @Query(() => Health, {
    description: `
      * 기능
        - 헬스 체크
      * 인증
        - 없음
    `,
  })
  health() {
    return this.healthService.check();
  }
}
