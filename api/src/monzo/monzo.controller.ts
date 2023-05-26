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
    try {
      if (transaction.type === 'transaction.created') {
        let description = transaction.data.merchant?.name || transaction.data.counterparty?.name;
        const type = transaction.data.amount > 0 ? 'incoming' : 'outgoing';
        if (!description && transaction.data.description.startsWith('pot_')) {
          const pots = await this.monzoService.getPots();
          const pot = pots.find((pot) => pot.id === transaction.data.description);
          if (pot) {
            description = `${type === 'incoming' ? 'Withdrawal from' : 'Deposit to'} ${pot.name}`;
          } else {
            description = type === 'incoming' ? 'Withdrawal from pot' : 'Deposit to pot';
          }
        }
        if (description === 'Flex') {
          description = transaction.data.notes;
        }
        const amount = Math.abs(transaction.data.amount) / 100;
        await this.transactionService.create({
          id: transaction.data.id,
          amount,
          created: transaction.data.created,
          type,
          logoUrl: transaction.data.merchant?.logo,
          description: description.trim(),
          transaction: transaction.data,
        });
        const employer = (await this.employerService.getAll())[0];
        const finances = await this.financesService.getAll();
        if (employer && employer.name === description) {
          const salary = finances.find((finance) => finance.id === '0').amount;
          if (amount >= salary - 100) {
            async.eachSeries(finances, async (potInfo: Finances) => {
              if (potInfo.id !== '0') {
                console.log('Pot ID: {0} - Amount {1}', potInfo.id, potInfo.amount);
                await this.monzoService.depositToPot(
                  potInfo.id,
                  Math.trunc(potInfo.amount * 100),
                  transaction.data.account_id,
                );
              }
            });
          }
        } else {
          const dynamicPot = finances.find((finance) => finance.dynamicPot && finance.name === description);
          if (dynamicPot) {
            await this.monzoService.withdrawFromPot(
              dynamicPot.id,
              Math.trunc(dynamicPot.amount * 100),
              transaction.data.account_id,
            );
          }
        }
      }
    } catch (error) {
      //Writes the error, but prevents Monzo from calling over and over
      console.error(error);
    }
  }
}
