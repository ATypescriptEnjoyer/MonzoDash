/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, NotFoundException, Put } from '@nestjs/common';
import { PotPaymentsService } from './potPayments.service';
import { TransactionsService } from 'src/transactions/transactions.service';

interface PotPaymentDto {
  transactionId: string;
  potId: string;
}

@Controller('PotPayments')
export class PotPaymentsController {
  constructor(
    private readonly potPaymentsService: PotPaymentsService,
    private readonly transactionService: TransactionsService,
  ) {}

  @Get()
  async getPotPayments() {
    return this.potPaymentsService.getAll();
  }

  @Put()
  async putPotPayment(@Body() potPayment: PotPaymentDto) {
    const transaction = await this.transactionService.getById(potPayment.transactionId);
    if (!transaction || !transaction.groupId) {
      return new NotFoundException('Merchant Group ID not found.');
    }
    const existingPotPayment = await this.potPaymentsService.getAll({ groupId: transaction.groupId });
    return this.potPaymentsService.save({
      id: existingPotPayment.length > 0 ? existingPotPayment[0].id : undefined,
      groupId: transaction.groupId,
      potId: potPayment.potId,
    });
  }
}
