/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transactions } from './schemas/transactions.schema';
import { Between, ILike } from 'typeorm';
import dayjs from 'dayjs';

@Controller('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Get()
  async getTransactions(
    @Query('page', ParseIntPipe) page: number,
    @Query('search') search?: string,
    @Query('withInternal', ParseBoolPipe) withInternal = false,
  ): Promise<{ data: Transactions[]; pagination: { page: number; count: number } }> {
    const [transactions, count] = await this.transactionsService.getPage(
      page,
      20,
      ['amount', 'created', 'description', 'groupId', 'id', 'internal', 'logoUrl', 'type'],
      { ...(search ? { description: ILike(`%${search}%`) } : {}), ...(withInternal ? {} : { internal: false }) },
    );

    return {
      data: transactions,
      pagination: {
        page,
        count,
      },
    };
  }

  @Get('merchants')
  async getMerchants(@Query('search') search?: string) {
    const merchants = await this.transactionsService.repository.createQueryBuilder('transactions')
      .select(['description'])
      .where('LOWER(description) LIKE LOWER(:search)', { search: `%${search}%` })
      .distinct()
      .getRawMany();
    return merchants.map((transaction) => transaction.description);
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

  @Delete(':id')
  async deleteTransaction(@Param('id') id: string) {
    await this.transactionsService.deleteWhere({ id });
  }
}
