import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { AgreementsModule } from '../agreements/agreements.module';
import { VerificationsModule } from '../verifications/verifications.module';
import { UsersLoader } from './users.loader';
import { GoogleOauth2Module } from '../google-oauth2/google-oauth2.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    AgreementsModule,
    VerificationsModule,
    forwardRef(() => AuthModule),
    GoogleOauth2Module,
  ],
  providers: [UsersResolver, UsersService, ...usersProviders, UsersLoader],
  exports: [UsersService, ...usersProviders],
})
export class UsersModule {}
