import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const { GLITCHTIP_DSN } = process.env;
if (GLITCHTIP_DSN) {
  Sentry.init({
    dsn: GLITCHTIP_DSN,
    integrations: [
      // Add our Profiling integration
      nodeProfilingIntegration(),
    ],
    // Add Tracing by setting tracesSampleRate
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Set sampling rate for profiling
    // This is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });
}
