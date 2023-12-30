import { Mutation, Resolver } from '@nestjs/graphql';
import { GoogleOauth2Service } from './google-oauth2.service';

@Resolver()
export class GoogleOauth2Resolver {
  constructor(private readonly googleOauth2Service: GoogleOauth2Service) {}

  @Mutation(() => String, {
    description: `
      * 기능
        - 구글 인가 URL 생성
      * 인증
        - 없음
    `,
  })
  async generateGoogleAuthUrl() {
    return await this.googleOauth2Service.generateAuthUrl();
  }
}
