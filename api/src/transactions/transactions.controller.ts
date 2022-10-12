/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transactions } from './schemas/transactions.schema';

@Controller('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(): Promise<Transactions[]> {
    const transactions = await this.transactionsService.getAll();
    return transactions.sort((a, b) => b.created.getTime() - a.created.getTime()).slice(0, 10);
  }
}
