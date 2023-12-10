import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { subsProviders } from './subs.providers';
import { SubsService } from './subs.service';
import { SubsResolver } from './subs.resolver';
import { UsersModule } from '../users/users.module';
import { SubsLoader } from './subs.loader';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [SubsResolver, SubsService, SubsLoader, ...subsProviders],
})
export class SubsModule {}
