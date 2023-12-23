import { Mutation, Resolver } from '@nestjs/graphql';
import { GoogleOauth2Service } from './google-oauth2.service';

@Resolver()
export class GoogleOauth2Resolver {
  constructor(private readonly googleOauth2Service: GoogleOauth2Service) {}

  @Mutation(() => String)
  async generateGoogleAuthUrl() {
    return await this.googleOauth2Service.generateAuthUrl();
  }
}
