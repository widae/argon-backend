import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CompaniesResolver } from './companies.resolver';
import { CompaniesService } from './companies.service';
import { companiesProviders } from './companies.providers';

@Module({
  imports: [DatabaseModule],
  providers: [CompaniesResolver, CompaniesService, ...companiesProviders],
})
export class CompaniesModule {}
