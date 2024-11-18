import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PotPaymentsController } from './potPayments.controller';
import { PotPaymentsService } from './potPayments.service';
import { PotPaymentsSchema } from './schemas/potPayments.schema';
import { TransactionsModule } from '@api/transactions/transactions.module';

@Module({
  imports: [TypeOrmModule.forFeature([PotPaymentsSchema]), TransactionsModule],
  controllers: [PotPaymentsController],
  providers: [PotPaymentsService],
  exports: [PotPaymentsService],
})
export class PotPaymentsModule {}
