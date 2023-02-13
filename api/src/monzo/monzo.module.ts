import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { MonzoController } from './monzo.controller';
import { MonzoService } from './monzo.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TransactionsModule } from '../transactions/transactions.module';
import { FinancesModule } from '../finances/finances.module';
import { EmployerModule } from '../employer/employer.module';

@Module({
  imports: [
    RedisModule.forRoot({ config: { url: process.env.REDIS_URL } }),
    HttpModule.register({ baseURL: 'https://api.monzo.com/' }),
    forwardRef(() => AuthModule),
    TransactionsModule,
    FinancesModule,
    EmployerModule,
  ],
  controllers: [MonzoController],
  providers: [MonzoService],
  exports: [MonzoService],
})
export class MonzoModule {}
