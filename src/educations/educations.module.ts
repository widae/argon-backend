import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { educationsProviders } from './educations.providers';
import { EducationsService } from './educations.service';
import { EducationsResolver } from './educations.resolver';

@Module({
  imports: [DatabaseModule],
  providers: [EducationsResolver, ...educationsProviders, EducationsService],
  exports: [...educationsProviders],
})
export class EducationsModule {}
