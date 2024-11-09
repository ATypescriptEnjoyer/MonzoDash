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
import { DailyReportModule } from '../dailyReport/dailyReport.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from '../config/datasource.config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(getConfig()),
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
    DailyReportModule,
  ],
  providers: [
    HolidaysModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginMiddleware)
      .exclude(
        { path: '/auth/redirectUri', method: RequestMethod.GET },
        { path: '/auth/callback', method: RequestMethod.GET },
        { path: '/auth/isauthed', method: RequestMethod.GET },
        {
          path: '/monzo/webhook',
          method: RequestMethod.POST,
        },
      )
      .forRoutes(AuthController, EmployerController, FinancesController, MonzoController, TransactionsModule);
  }
}
