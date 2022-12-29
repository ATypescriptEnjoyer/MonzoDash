/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get } from '@nestjs/common';
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

    return transactions.reduce((prev: Transaction[], curr) => {
      const dateToMoment = moment(curr.created);
      const momentToday = moment().startOf('day');
      const momentYesterday = momentToday.clone().subtract('1', 'day').startOf('day');
      let localeDateString = '';
      if (dateToMoment.isSame(momentToday, 'd')) {
        localeDateString = 'Today';
      } else if (dateToMoment.isSame(momentYesterday, 'd')) {
        localeDateString = 'Yesterday';
      } else {
        localeDateString = `${moment(curr.created).format('dddd, D MMM')}${
          curr.created.getFullYear() !== new Date().getFullYear() ? ` ${curr.created.getFullYear()}` : ''
        }`;
      }
      const arrIndx = prev.findIndex((val) => val.title === localeDateString);
      if (arrIndx > -1) {
        prev[arrIndx] = { ...prev[arrIndx], transactions: [...prev[arrIndx].transactions, curr] };
        return prev;
      }
      return [...prev, { title: localeDateString, transactions: [curr] }];
    }, [] as Transaction[]);
  }
}
