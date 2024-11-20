/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transactions } from './schemas/transactions.schema';

@Controller('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(
    @Query('page') page: number,
  ): Promise<{ data: Transactions[]; pagination: { page: number; count: number } }> {
    const [transactions, count] = await this.transactionsService.getPage(page, 5);

    return {
      // Removing transaction JSON from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      data: transactions.map(({ transaction, ...value }) => value),
      pagination: {
        page,
        count,
      },
    };
  }
}
