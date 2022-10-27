import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MonzoModule } from '../monzo/monzo.module';
import { EmployerModule } from '../employer/employer.module';
import { FinancesModule } from '../finances/finances.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HolidaysModule } from '../holidays/holidays.module';
import { CommandModule } from 'nestjs-command';
import { HolidaysSeed } from 'src/holidays/seeds/holidays.seed';

console.log(join(__dirname, '..', 'client'));

@Module({
  imports: [
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
  ],
  providers: [HolidaysModule, HolidaysSeed],
})
export class AppModule {}
