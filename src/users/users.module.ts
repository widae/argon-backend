import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { AgreementsModule } from '../agreements/agreements.module';

@Module({
  imports: [DatabaseModule, AgreementsModule],
  providers: [UsersResolver, UsersService, ...usersProviders],
})
export class UsersModule {}
