import { createParamDecorator, ExecutionContext, Type } from '@nestjs/common';
import { NEST_LOADER_CONTEXT_KEY } from '../constants';
import { GqlExecutionContext } from '@nestjs/graphql';
import { NestDataLoader } from '../interfaces/nest-data-loader.interface';

export const Loader = createParamDecorator(
  async (
    data: Type<NestDataLoader<any, any>>,
    context: ExecutionContext & { [key: string]: any },
  ) => {
    const ctx = GqlExecutionContext.create(context).getContext();

    if (ctx[NEST_LOADER_CONTEXT_KEY] === undefined) {
      throw new Error('인터셉터를 제공해야 합니다.');
    }

    return await ctx[NEST_LOADER_CONTEXT_KEY].getLoader(data);
  },
);
