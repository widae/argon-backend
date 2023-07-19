import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurRefreshTokenPayload = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return GqlExecutionContext.create(context).getContext().req.user;
  },
);
