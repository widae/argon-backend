import {
  Catch,
  ForbiddenException,
  Inject,
  LoggerService,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { CustomHttpException } from '../exceptions/custom-http.exception';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch()
export class AllExceptionsFilter implements GqlExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: any) {
    let custom: CustomHttpException;

    if (exception instanceof CustomHttpException) {
      custom = exception;
    } else {
      if (exception instanceof UnauthorizedException) {
        custom = new CustomHttpException('E_401_000', { cause: exception });
      } else if (exception instanceof ForbiddenException) {
        custom = new CustomHttpException('E_403_000', { cause: exception });
      } else if (exception instanceof NotFoundException) {
        custom = new CustomHttpException('E_404_000', { cause: exception });
      } else {
        custom = new CustomHttpException('E_500_000', { cause: exception });
      }
    }

    this.logger.error(custom);
  }
}
