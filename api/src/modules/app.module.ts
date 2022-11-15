import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MonzoModule } from '../monzo/monzo.module';
import { EmployerModule } from '../employer/employer.module';
import { FinancesModule } from '../finances/finances.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HolidaysModule } from '../holidays/holidays.module';
import { CommandModule } from 'nestjs-command';
import { HolidaysSeed } from '../holidays/seeds/holidays.seed';
import { LoginMiddleware } from '../login/login.middleware';
import { LoginModule } from '../login/login.module';
import { AuthController } from '../auth/auth.controller';
import { EmployerController } from '../employer/employer.controller';
import { FinancesController } from '../finances/finances.controller';
import { MonzoController } from '../monzo/monzo.controller';
import { TransactionsModule } from '../transactions/transactions.module';
import { ScheduleModule } from '@nestjs/schedule';

console.log(join(__dirname, '..', 'client'));

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const username = configService.get<string>('MONGO_USERNAME');
        const password = configService.get<string>('MONGO_PASSWORD');
        const hostname = configService.get<string>('MONGO_HOST');
        return {
          uri: `mongodb://${username}:${password}@${hostname}/monzodash?authSource=admin`,
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    AuthModule,
    MonzoModule,
    EmployerModule,
    FinancesModule,
    HolidaysModule,
    CommandModule,
    LoginModule,
    TransactionsModule,
  ],
  providers: [HolidaysModule, HolidaysSeed],
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
  }
}
