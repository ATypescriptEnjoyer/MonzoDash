import { MongooseModule } from '@nestjs/mongoose';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MonzoModule } from '../monzo/monzo.module';
import { EmployerModule } from '../employer/employer.module';
import { FinancesModule } from '../finances/finances.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HolidaysModule } from '../holidays/holidays.module';
import { LoginMiddleware } from '../login/login.middleware';
import { LoginModule } from '../login/login.module';
import { AuthController } from '../auth/auth.controller';
import { EmployerController } from '../employer/employer.controller';
import { FinancesController } from '../finances/finances.controller';
import { MonzoController } from '../monzo/monzo.controller';
import { TransactionsModule } from '../transactions/transactions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MigrationsModule } from '../migrations/migrations.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from '../sentry/sentry.interceptor';
import * as Sentry from '@sentry/node';
import { SentryFilter } from '../sentry/sentry.filter';
import { DailyReportModule } from '../dailyReport/dailyReport.module';

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, SENTRY_DSN } = process.env;

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/monzodash?authSource=admin`),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    AuthModule,
    MonzoModule,
    EmployerModule,
    FinancesModule,
    HolidaysModule,
    LoginModule,
    TransactionsModule,
    MigrationsModule,
    DailyReportModule,
  ],
  providers: [
    HolidaysModule,
    ...(SENTRY_DSN
      ? [
          {
            provide: APP_INTERCEPTOR,
            useClass: SentryInterceptor,
          },
          {
            provide: APP_FILTER,
            useClass: SentryFilter,
          },
        ]
      : []),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginMiddleware)
      .exclude(
        { path: '/api/auth/redirectUri', method: RequestMethod.GET },
        { path: '/api/auth/callback', method: RequestMethod.GET },
        {
          path: '/api/monzo/webhook',
          method: RequestMethod.POST,
        },
      )
      .forRoutes(AuthController, EmployerController, FinancesController, MonzoController, TransactionsModule);

    consumer.apply(Sentry.Handlers.requestHandler()).forRoutes('*');
  }
}
