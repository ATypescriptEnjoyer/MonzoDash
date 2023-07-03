import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    Sentry.configureScope((scope) => {
      scope.setExtra('requestBody', req.body);
      scope.setExtra('requestParams', req.params);
      scope.setExtra('requestQuery', req.query);
    });

    const transaction = Sentry.startTransaction({
      name: `${req.method} ${req.path}`,
      sampled: true,
    });

    transaction.finish();

    return next.handle();
  }
}
