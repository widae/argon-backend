import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { EnvVars } from '../env.validation';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleOauth2Service {
  private readonly oauth2Client: OAuth2Client;

  constructor(private readonly configService: ConfigService<EnvVars, true>) {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID', {
      infer: true,
    });
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET', {
      infer: true,
    });
    const redirectUri = this.configService.get('GOOGLE_REDIRECT_URI', {
      infer: true,
    });

    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri,
    );
  }

  async generateAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.email'],
    });
  }

  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }
}
