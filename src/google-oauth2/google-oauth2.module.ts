import { Module } from '@nestjs/common';
import { GoogleOauth2Service } from './google-oauth2.service';
import { ConfigModule } from '@nestjs/config';
import { GoogleOauth2Resolver } from './google-oauth2.resolver';

@Module({
  imports: [ConfigModule],
  providers: [GoogleOauth2Resolver, GoogleOauth2Service],
  exports: [GoogleOauth2Service],
})
export class GoogleOauth2Module {}
