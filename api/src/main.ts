import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';

const { SENTRY_DSN, DEBUG } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  if (SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      debug: DEBUG === 'true',
      environment: DEBUG === 'true' ? 'dev' : 'production',
      tracesSampleRate: 1.0,
      integrations: [
        new RewriteFrames({
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
