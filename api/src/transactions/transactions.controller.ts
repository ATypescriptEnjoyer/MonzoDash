/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transactions } from './schemas/transactions.schema';

@Controller('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Get()
  async getTransactions(): Promise<Transactions[]> {
    let transactions: Transactions[] = await this.transactionsService.getAll();
    transactions = transactions.map(
      (transactionItem): Transactions => ({
        id: transactionItem.id,
        created: transactionItem.created,
        logoUrl: transactionItem.logoUrl,
        amount: transactionItem.amount,
        type: transactionItem.type,
        description: transactionItem.description,
        internal: transactionItem.internal,
      }),
    );
    transactions = transactions.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    return transactions;
  }

  @Get('monthly-burndown/:month')
  async getMonthlyBurndown(@Param('month') month: number): Promise<{ [index: number]: number }> {
    const properDate = new Date(new Date().getFullYear(), month - 1, 0);
    const transactions: Transactions[] = await this.transactionsService.repository
      .createQueryBuilder()
      .where("MONTH(dateField) = :month", { month })
      .getMany();
    const dates = Array.from(new Array(properDate.getDate()).keys())
      .slice(1)
      .reduce(
        (prev, curr) => ({
          ...prev,
          [curr]: transactions
            .filter((transaction) => new Date(transaction.created).getDate() === curr)
            .reduce((prev, curr) => (prev += curr.amount), 0),
        }),
        {},
      );

    return dates;
  }
}
