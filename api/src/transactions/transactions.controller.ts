/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transactions } from './schemas/transactions.schema';

@Controller('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(): Promise<Transactions[]> {
    const transactions = await this.transactionsService.getAll();
    transactions.map((transactionItem) => ({ ...transactionItem, transaction: {} })); //dont send over full transact data, not used on frontend
    return transactions.sort((a, b) => b.created.getTime() - a.created.getTime()).slice(0, 10);
  }
}
