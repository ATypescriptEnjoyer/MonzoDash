/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, forwardRef, Get, Inject, Put } from '@nestjs/common';
import * as moment from 'moment';
import { CurrentFinances, DedicatedFinance } from '../../../shared/interfaces/finances';
import { calculatePayDay } from '../../util/calculatePayDay';
import { EmployerService } from '../employer/employer.service';
import { MonzoService } from '../monzo/monzo.service';
import { FinancesService } from './finances.service';
import { Finances } from './schemas/finances.schema';

@Controller('Finances')
export class FinancesController {
  constructor(
    private readonly financesService: FinancesService,
    private readonly employerService: EmployerService,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
  ) {}

  @Get('dedicated')
  async dedicatedFinances(): Promise<{ status: boolean; data: DedicatedFinance[] }> {
    let dedicated = await this.financesService.getAll();
    if (dedicated.length > 0) {
      return {
        status: true,
        data: dedicated,
      };
    }
    const monzoPots = await this.monzoService.getPots();
    return {
      status: false,
      data: monzoPots.map(({ id, name }) => ({ id, name, amount: 0, colour: '#FFFFFF' })),
    };
  }

  @Put('dedicated')
  async putDedicatedFinances(
    @Body() dedicatedDto: DedicatedFinance[],
  ): Promise<{ status: boolean; data: DedicatedFinance[] }> {
    const takeHomeRemaining = dedicatedDto
      .filter((finance) => finance.id !== '0')
      .reduce((prev, curr) => (prev += curr.amount), 0);
    const takeHomeIndex = dedicatedDto.findIndex((finance) => finance.id === '0');
    if (takeHomeIndex !== -1) {
      const finalValue = dedicatedDto[takeHomeIndex].amount - takeHomeRemaining;
      dedicatedDto[takeHomeIndex].amount = parseFloat(finalValue.toFixed(2));
    }
    const financePromises = dedicatedDto.map(async (value) => {
      return this.financesService.create(value);
    });

    const finances = await Promise.all(financePromises);

    return {
      status: true,
      data: finances,
    };
  }

  @Get('current')
  async currentFinances(): Promise<CurrentFinances> {
    const balance = await this.monzoService.getBalance();
    const employer = (await this.employerService.getAll())[0];
    if (employer) {
      const payDate = await calculatePayDay(employer.payDay);
      const daysUntil = moment(payDate).diff(moment(), 'days');

      return {
        balancePence: balance,
        daysTilPay: daysUntil,
        perDayPence: balance / daysUntil,
      };
    }

    return null;
  }
}
