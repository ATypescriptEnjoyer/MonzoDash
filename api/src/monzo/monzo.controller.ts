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
import { MonzoService, Pot } from './monzo.service';
import { Transactions } from '../transactions/schemas/transactions.schema';
import { PotPaymentsService } from 'src/potPayments/potPayments.service';
import { getTransactionDescription } from 'src/util/getTransactionDescription';

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
      const description = getTransactionDescription(transaction.data, await this.monzoService.getPots());
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
        await this.monzoService.withdrawFromPot(payPot.potId, transaction.data.amount, transaction.data.account_id);
      }
    } catch (error) {
      //Writes the error, but prevents Monzo from calling over and over
      console.error(error);
    }
  }
}
