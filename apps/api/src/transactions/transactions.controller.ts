/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transactions } from './schemas/transactions.schema';
import { Between } from 'typeorm';
import moment from 'moment';

@Controller('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(
    @Query('page') page: number,
  ): Promise<{ data: Transactions[]; pagination: { page: number; count: number } }> {
    const [transactions, count] = await this.transactionsService.getPage(page, 5, [
      'amount',
      'created',
      'description',
      'groupId',
      'id',
      'internal',
      'logoUrl',
      'type',
    ]);

    return {
      data: transactions,
      pagination: {
        page,
        count,
      },
    };
  }

  @Post('export/:from/:to')
  async exportTransactions(@Param('from') from: string, @Param('to') to: string) {
    const transactions = await this.transactionsService.repository.find({
      where: {
        created: Between(
          moment(from).startOf('day').format('YYYY-MM-DD HH:MM:SS'),
          moment(to).endOf('day').format('YYYY-MM-DD HH:MM:SS'),
        ),
      },
    });
    return transactions;
  }
}
