import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MonzoController } from './monzo.controller';
import { MonzoService } from './monzo.service';
import { TransactionsModule } from '../transactions/transactions.module';
import { FinancesModule } from '../finances/finances.module';
import { EmployerModule } from '../employer/employer.module';
import { HttpModule } from '@nestjs/axios';
import { LoginModule } from '../login/login.module';
import { PotPaymentsModule } from '../potPayments/potPayments.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => LoginModule),
    PotPaymentsModule,
    TransactionsModule,
    FinancesModule,
    EmployerModule,
    HttpModule.register({ baseURL: 'https://api.monzo.com/' }),
  ],
  controllers: [MonzoController],
  providers: [MonzoService],
  exports: [MonzoService],
})
export class MonzoModule {}
