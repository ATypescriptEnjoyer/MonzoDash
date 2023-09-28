/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transactions } from './schemas/transactions.schema';
import { Transaction } from '../../../shared/interfaces/transaction';
import * as moment from 'moment';

@Controller('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(): Promise<Transaction[]> {
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
    transactions = transactions.sort((a, b) => b.created.getTime() - a.created.getTime());

    return transactions;
  }

  @Get('monthly-burndown/:month')
  async getMonthlyBurndown(@Param('month') month: number): Promise<{ [index: number]: number }> {
    const properDate = new Date(new Date().getFullYear(), month - 1, 0);
    const transactions: Transactions[] = await this.transactionsService.model.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: '$created' }, month],
          },
        },
      },
    ]);
    const dates = Array.from(new Array(properDate.getDate()).keys())
      .slice(1)
      .reduce(
        (prev, curr) => ({
          ...prev,
          [curr]: transactions
            .filter((transaction) => transaction.created.getDate() === curr)
            .reduce((prev, curr) => (prev += curr.amount), 0),
        }),
        {},
      );

    return dates;
  }
}
