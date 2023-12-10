import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { AgreementsModule } from '../agreements/agreements.module';
import { VerificationsModule } from '../verifications/verifications.module';
import { UsersLoader } from './users.loader';

@Module({
  imports: [DatabaseModule, AgreementsModule, VerificationsModule],
  providers: [UsersResolver, UsersService, ...usersProviders, UsersLoader],
  exports: [UsersService, ...usersProviders],
})
export class UsersModule {}
