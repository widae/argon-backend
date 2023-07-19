import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVars, validate } from './env.validation';
import { PoliciesModule } from './policies/policies.module';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { VerificationsModule } from './verifications/verifications.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    WinstonModule.forRoot({
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.prettyPrint({ colorize: true }),
      ),
      transports: [new transports.Console()],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<EnvVars, true>,
      ): Promise<RedisModuleOptions> => {
        const host = configService.get('REDIS_HOST', { infer: true });
        const port = configService.get('REDIS_PORT', { infer: true });
        const password = configService.get('REDIS_PASSWORD', { infer: true });

        return {
          config: {
            host,
            port,
            password,
          },
        };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    HealthModule,
    UsersModule,
    PoliciesModule,
    VerificationsModule,
    AuthModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
