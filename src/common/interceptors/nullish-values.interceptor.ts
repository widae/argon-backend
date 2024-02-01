import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomHttpException } from '../exceptions/custom-http.exception';

@Injectable()
export class NullishValuesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((value) => {
        if (value == null) {
          throw new CustomHttpException('E_404_000');
        }
      }),
    );
  }
}
