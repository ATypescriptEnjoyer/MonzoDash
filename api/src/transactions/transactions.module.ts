import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transactions, TransactionsSchema } from './schemas/transactions.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Transactions.name, schema: TransactionsSchema }])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
