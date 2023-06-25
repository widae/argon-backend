import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { agreementsProviders } from './agreements.providers';
import { AgreementsService } from './agreements.service';
import { PoliciesModule } from '../policies/policies.module';

@Module({
  imports: [DatabaseModule, PoliciesModule],
  providers: [AgreementsService, ...agreementsProviders],
  exports: [AgreementsService],
})
export class AgreementsModule {}
