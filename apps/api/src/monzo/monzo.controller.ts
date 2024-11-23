/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post } from '@nestjs/common';
import async from 'async';
import { Owner } from './monzo.interfaces';
import { EmployerService } from '../employer/employer.service';
import { FinancesService } from '../finances/finances.service';
import { Finances } from '../finances/schemas/finances.schema';
import { TransactionsService } from '../transactions/transactions.service';
import { WebhookTransaction } from './monzo.interfaces';
import { MonzoService } from './monzo.service';
import { Transactions } from '../transactions/schemas/transactions.schema';
import { PotPaymentsService } from '../potPayments/potPayments.service';
import { getTransactionDescription } from '../util/getTransactionDescription';

@Controller('monzo')
export class MonzoController {
  constructor(
    private readonly monzoService: MonzoService,
    private readonly transactionService: TransactionsService,
    private readonly financesService: FinancesService,
    private readonly employerService: EmployerService,
    private readonly potPaymentsService: PotPaymentsService,
  ) {}

  @Get('getUser')
  async getUser(): Promise<Owner> {
    const userInfo = await this.monzoService.getUserInfo();
    return userInfo;
  }

  @Get('pots')
  async getPots(): Promise<Set<string>> {
    const pots = await this.monzoService.getPots();
    return pots.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.name }), new Set<string>());
  }

  @Post('webhook')
  async webhook(@Body() transaction: WebhookTransaction): Promise<void> {
    try {
      if (transaction.type !== 'transaction.created' || transaction.data.amount === 0) {
        return;
      }
      const pots = await this.monzoService.getPots();
      const description = getTransactionDescription(transaction.data, pots);
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
        type: amount > 0 ? 'incoming' : 'outgoing',
        logoUrl: transaction.data.merchant?.logo,
        description: description.trim(),
        transaction: transaction.data,
        groupId: transaction.data.merchant?.group_id,
      } as Transactions);
      if (transaction.ignoreProcessing) {
        return;
      }
      if (isPaymentFromEmployer && isSalaryPayment) {
        async.eachSeries(
          finances.filter((finance) => finance.id !== '0' && finance.amount > 0),
          (potInfo: Finances) =>
            this.monzoService.depositToPot(potInfo.id, Math.trunc(potInfo.amount * 100), transaction.data.account_id),
        );
        return;
      }
      const potPayments = await this.potPaymentsService.getAll();
      const payPot = potPayments.find((potPayment) => potPayment.groupId === transaction.data.merchant.group_id);
      if (payPot) {
        const pot = pots.find((pot) => pot.id === payPot.potId);
        if (!pot) {
          return;
        }
        if (pot.balance === 0) {
          await this.monzoService.sendNotification(
            'Failed to pay from pot',
            `No money left in pot to pay for ${description}`,
          );
          return;
        }
        if (pot.balance < transaction.data.amount) {
          await this.monzoService.withdrawFromPot(payPot.potId, pot.balance, transaction.data.account_id);
          await this.monzoService.sendNotification(
            'Partially paid for ${description}',
            `There wasn't enough money to pay for ${description}. Withdrew remaining £${Math.abs(pot.balance) / 100}.`,
          );
          return;
        }
        if (pots.find((pot) => pot.id === payPot.potId).balance >= transaction.data.amount) {
          await this.monzoService.withdrawFromPot(payPot.potId, transaction.data.amount, transaction.data.account_id);
          return;
        }
      }
    } catch (error) {
      //Writes the error, but prevents Monzo from calling over and over
      console.error(error);
    }
  }
}
