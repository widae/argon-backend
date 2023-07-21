import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SchoolsResolver } from './schools.resolver';
import { SchoolsService } from './schools.service';
import { schoolsProviders } from './schools.providers';

@Module({
  imports: [DatabaseModule],
  providers: [SchoolsResolver, ...schoolsProviders, SchoolsService],
  exports: [...schoolsProviders],
})
export class SchoolsModule {}
