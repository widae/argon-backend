import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { policiesProviders } from './policies.providers';
import { PoliciesService } from './policies.service';
import { PoliciesResolver } from './policies.resolver';

@Module({
  imports: [DatabaseModule],
  providers: [PoliciesResolver, PoliciesService, ...policiesProviders],
  exports: [...policiesProviders],
})
export class PoliciesModule {}
