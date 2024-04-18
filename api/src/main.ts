import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as Sentry from '@sentry/node';
import { rewriteFramesIntegration } from '@sentry/integrations';
import { NestApplicationOptions } from '@nestjs/common';

const { SENTRY_DSN, DEBUG } = process.env;

async function bootstrap() {
  const opts: NestApplicationOptions = SENTRY_DSN ? { logger: false } : null;
  const app = await NestFactory.create(AppModule, opts);
  if (SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      debug: DEBUG === 'true',
      environment: DEBUG === 'true' ? 'dev' : 'production',
      tracesSampleRate: 1.0,
      integrations: [
        rewriteFramesIntegration({
          root: global['__rootdir__'],
        }),
      ],
    });
    console.log('Sentry Configured');
  }
  app.enableCors();
  app.setGlobalPrefix('/api');
  await app.listen(5000);
}
bootstrap();
