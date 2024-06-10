import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    Sentry.getCurrentScope()
      .setExtra('requestBody', req.body)
      .setExtra('requestParams', req.params)
      .setExtra('requestQuery', req.query);

    return next.handle();
  }
}
