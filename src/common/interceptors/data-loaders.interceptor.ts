import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { NEST_LOADER_CONTEXT_KEY } from '../constants';
import { NestDataLoader } from '../interfaces/nest-data-loader.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class DataLoadersInterceptor implements NestInterceptor {
  constructor(
    private readonly moduleRef: ModuleRef,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = GqlExecutionContext.create(context).getContext();

    if (ctx[NEST_LOADER_CONTEXT_KEY] === undefined) {
      ctx[NEST_LOADER_CONTEXT_KEY] = {
        contextId: ContextIdFactory.create(),
        getLoader: (type: string): Promise<NestDataLoader<any, any>> => {
          if (ctx[type] === undefined) {
            try {
              ctx[type] = (async () => {
                return (
                  await this.moduleRef.resolve<NestDataLoader<any, any>>(
                    type,
                    ctx[NEST_LOADER_CONTEXT_KEY].contextId,
                    {
                      strict: false,
                    },
                  )
                ).generateDataLoader();
              })();
            } catch (err) {
              this.logger.error(err);
              throw err;
            }
          }

          return ctx[type];
        },
      };
    }

    return next.handle();
  }
}
