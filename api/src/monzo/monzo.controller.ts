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
import { ActualbudgetService } from '../actualbudget/actualbudget.service';
import { Transaction as ActualBudgetTransaction } from '../actualbudget/actualbudget.interfaces';
import { formatText } from '..//formatText';

@Controller('monzo')
export class MonzoController {
  constructor(
    private readonly monzoService: MonzoService,
    private readonly transactionService: TransactionsService,
    private readonly financesService: FinancesService,
    private readonly employerService: EmployerService,
    private readonly actualBudgetService: ActualbudgetService,
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
        const isPaymentFromEmployer = (employer && employer.name === description) || isSalaryPayment; //Allow empty employer name for cases of unsure employer bank name.
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
        if (this.actualBudgetService.available()) {
          console.log('Forwarding data to ActualBudget');
          let account = await this.actualBudgetService.getAccount('Monzo');
          if (!account) {
            const accValue = await this.monzoService.getBalance();
            const prevAccValue = accValue - transaction.data.amount;
            account = await this.actualBudgetService.createAccount({ name: 'Monzo', type: 'checking' }, prevAccValue);
          }
          const categoryText = formatText(transaction.data.category);
          let category = await this.actualBudgetService.getCategory(categoryText);
          if (!category) {
            const categoryGroup = await this.actualBudgetService.getCategoryGroup(
              isPaymentFromEmployer ? 'Income' : 'Usual Expenses',
            );
            category = await this.actualBudgetService.createCategory({
              name: categoryText,
              group_id: categoryGroup.id,
              is_income: isPaymentFromEmployer,
            });
          }
          const actualBudgetTransaction: ActualBudgetTransaction = {
            account: account.id,
            amount: transaction.data.amount,
            category: category.id,
            date: transaction.data.created.split('T')[0],
            payee_name: transaction.data.merchant?.name || transaction.data.counterparty?.name,
            cleared: true,
            notes: transaction.data.notes,
            imported_id: transaction.data.id,
          };
          await this.actualBudgetService.createTransaction(account.id, actualBudgetTransaction);
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
