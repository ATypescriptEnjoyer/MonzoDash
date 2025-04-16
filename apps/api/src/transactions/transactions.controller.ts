/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transactions } from './schemas/transactions.schema';
import { Between, ILike } from 'typeorm';
import dayjs from 'dayjs';

@Controller('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(
    @Query('page', ParseIntPipe) page: number,
    @Query('search') search?: string,
  ): Promise<{ data: Transactions[]; pagination: { page: number; count: number } }> {
    const [transactions, count] = await this.transactionsService.getPage(
      page,
      20,
      ['amount', 'created', 'description', 'groupId', 'id', 'internal', 'logoUrl', 'type'],
      { description: search ? ILike(`%${search}%`) : undefined },
    );

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
          dayjs(from).startOf('day').format('YYYY-MM-DD HH:MM:SS'),
          dayjs(to).endOf('day').format('YYYY-MM-DD HH:MM:SS'),
        ),
      },
    });
    return transactions;
  }
}
