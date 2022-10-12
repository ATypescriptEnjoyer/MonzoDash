/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post } from '@nestjs/common';
import async from 'async';
import { Owner } from '../../../shared/interfaces/monzo';
import { EmployerService } from '../employer/employer.service';
import { FinancesService } from '../finances/finances.service';
import { Finances } from '../finances/schemas/finances.schema';
import { TransactionsService } from '../transactions/transactions.service';
import { WebhookTransaction } from './monzo.interfaces';
import { MonzoService } from './monzo.service';

@Controller('monzo')
export class MonzoController {
  constructor(
    private readonly monzoService: MonzoService,
    private readonly transactionService: TransactionsService,
    private readonly financesService: FinancesService,
    private readonly employerService: EmployerService,
  ) {}

  @Get('getUser')
  async getUser(): Promise<Owner> {
    const userInfo = await this.monzoService.getUserInfo();
    return userInfo;
  }

  @Post('webhook')
  async webhook(@Body() transaction: WebhookTransaction): Promise<void> {
    if (transaction.type === 'transaction.created') {
      const description = transaction.data.merchant?.name || transaction.data.counterparty?.name;
      const amount = Math.abs(transaction.data.amount) / 100;
      await this.transactionService.create({
        id: transaction.data.id,
        amount,
        created: transaction.data.created,
        type: transaction.data.amount > 0 ? 'incoming' : 'outgoing',
        logoUrl: transaction.data.merchant?.logo,
        description,
      });
      const employer = (await this.employerService.getAll())[0];
      if (employer && employer.name === description) {
        const finances = await this.financesService.getAll();
        const totalDedicatedSpending = finances.reduce((prev, curr) => (prev += curr.amount), 0);
        if (amount >= totalDedicatedSpending - 100) {
          await async.eachSeries(finances, async (potInfo: Finances) => {
            if (potInfo.id !== '0') {
              await this.monzoService.depositToPot(potInfo.id, potInfo.amount * 100);
            }
          });
        }
      }
    }
    return;
  }
}
