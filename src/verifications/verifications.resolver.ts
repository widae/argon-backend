import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { VerificationsService } from './verifications.service';
import { Verification } from './verification.model';
import { CreateEmailVerificationInput } from './dto/create-email-verification.input';

@Resolver(() => Verification)
export class VerificationsResolver {
  constructor(private readonly verificationsService: VerificationsService) {}

  @Mutation(() => Verification, {
    description: `
      * 기능
        - 이메일 인증 생성
      * 인증
        - 없음
    `,
  })
  async createEmailVerification(
    @Args('input') input: CreateEmailVerificationInput,
  ) {
    return await this.verificationsService.createEmailVerification(input.email);
  }
}
