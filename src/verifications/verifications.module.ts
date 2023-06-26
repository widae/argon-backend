import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VerificationsResolver } from './verifications.resolver';
import { VerificationsService } from './verifications.service';
import { verificationsProviders } from './verifications.providers';
import { EmailsModule } from '../emails/emails.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, DatabaseModule, EmailsModule],
  providers: [
    VerificationsResolver,
    VerificationsService,
    ...verificationsProviders,
  ],
  exports: [VerificationsService],
})
export class VerificationsModule {}
