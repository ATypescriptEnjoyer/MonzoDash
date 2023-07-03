import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    Sentry.withScope((scope) => {
      scope.setExtra('request', request);
      scope.setExtra('response', response);
      Sentry.captureException(exception);
    });

    super.catch(exception, host);
  }
}
