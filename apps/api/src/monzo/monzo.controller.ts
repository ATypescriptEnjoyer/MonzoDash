/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, UnprocessableEntityException } from '@nestjs/common';
import { EmployerService } from '../employer/employer.service';
import { FinancesService } from '../finances/finances.service';
import { TransactionsService } from '../transactions/transactions.service';
import { WebhookTransaction, Owner } from './monzo.interfaces';
import { MonzoService } from './monzo.service';
import { Transactions } from '../transactions/schemas/transactions.schema';
import { PotPaymentsService } from '../potPayments/potPayments.service';
import { getTransactionDescription } from '../util/getTransactionDescription';
import { isValidTransaction } from '../util/isValidTransaction';

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
    if (!transaction || !isValidTransaction(transaction)) {
      throw new UnprocessableEntityException();
    }

    const pots = await this.monzoService.getPots();
    const finances = await this.financesService.getAll();
    const description = getTransactionDescription(transaction.data, pots);
    const salary = finances.find((finance) => finance.id === '0').amount ?? 99999;
    const amount = Math.abs(transaction.data.amount) / 100;

    const isSalaryPayment = amount >= salary - salary / 20;
    const employer = (await this.employerService.getAll())[0];
    const employerName = employer ? employer.name : '';
    const isPaymentFromEmployer = employerName === description || isSalaryPayment;

    if (employerName === '' && isSalaryPayment) {
      await this.employerService.save({ ...employer, name: description });
    }

    const savedTransaction = await this.transactionService.save({
      id: transaction.data.id,
      amount,
      created: transaction.data.created,
      type: transaction.data.amount > 0 ? 'incoming' : 'outgoing',
      logoUrl: transaction.data.merchant?.logo,
      description: description.trim(),
      transaction: transaction.data,
      groupId: transaction.data.merchant?.group_id,
    } as Transactions);

    if (transaction.ignoreProcessing) {
      return;
    }

    if (isPaymentFromEmployer && isSalaryPayment) {
      for (const potInfo of finances.filter((finance) => finance.id !== '0' && finance.amount > 0)) {
        await this.monzoService.depositToPot(potInfo.id, Math.trunc(potInfo.amount * 100), transaction.data.account_id);
      }
      return;
    }

    if (savedTransaction.type === 'incoming' || savedTransaction.internal) {
      return;
    }

    const potPayments = await this.potPaymentsService.getAll();
    const { potId } = potPayments.find((potPayment) => potPayment.groupId === savedTransaction.groupId) ?? {};
    const pot = pots.find((pot) => pot.id === potId);
    if (!pot || pot.balance === 0) {
      return;
    }

    if (pot.balance < transaction.data.amount) {
      await this.monzoService.withdrawFromPot(potId, pot.balance, transaction.data.account_id);
      await this.monzoService.sendNotification(
        `Partially paid for ${description}`,
        `There wasn't enough money to pay for ${description}. Withdrew remaining £${Math.abs(pot.balance) / 100}.`,
      );
      return;
    }

    if (pot.balance >= transaction.data.amount) {
      await this.monzoService.withdrawFromPot(potId, transaction.data.amount, transaction.data.account_id);
    }
  }
}
