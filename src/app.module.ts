import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { PoliciesModule } from './policies/policies.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    HealthModule,
    PoliciesModule,
  ],
})
export class AppModule {}
