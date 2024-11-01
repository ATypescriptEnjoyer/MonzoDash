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
import { Transactions } from '../transactions/schemas/transactions.schema';

@Controller('monzo')
export class MonzoController {
  constructor(
    private readonly monzoService: MonzoService,
    private readonly transactionService: TransactionsService,
    private readonly financesService: FinancesService,
    private readonly employerService: EmployerService,
  ) { }

  @Get('getUser')
  async getUser(): Promise<Owner> {
    const userInfo = await this.monzoService.getUserInfo();
    return userInfo;
  }

  @Post('webhook')
  async webhook(@Body() transaction: WebhookTransaction): Promise<void> {
    try {
      if (transaction.type === 'transaction.created') {
        if (transaction.data.amount === 0) {
          return;
        }
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
        const finances = await this.financesService.getAll();
        const salary = finances.find((finance) => finance.id === '0').amount ?? 99999;
        const amount = Math.abs(transaction.data.amount) / 100;
        const isSalaryPayment = amount >= salary - salary / 20;
        const employer = (await this.employerService.getAll())[0];
        const employerName = employer ? employer.name : '';
        const isPaymentFromEmployer = employerName === '' ? isSalaryPayment : employerName === description; //Allow empty employer name for cases of unsure employer bank name.
        if (employerName === '' && isSalaryPayment) {
          employer.name = description;
          await this.employerService.save(employer);
        }
        await this.transactionService.save({
          id: transaction.data.id,
          amount,
          created: transaction.data.created,
          type,
          logoUrl: transaction.data.merchant?.logo,
          description: description.trim(),
          transaction: transaction.data,
        } as unknown as Transactions);
        if (transaction.ignoreProcessing) {
          return;
        }
        if (isPaymentFromEmployer) {
          if (isSalaryPayment) {
            async.eachSeries(finances, async (potInfo: Finances) => {
              if (potInfo.id !== '0' && potInfo.amount > 0) {
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
