import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomHttpException } from '../../common/exceptions/custom-http.exception';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlRefreshGuard extends AuthGuard('jwt-refresh-token') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    return GqlExecutionContext.create(context).getContext().req;
  }

  handleRequest(err: any, payload: any) {
    if (err || !payload) {
      throw new CustomHttpException('E_401_000', { cause: err });
    }
    return payload;
  }
}
