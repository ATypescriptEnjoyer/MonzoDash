/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, forwardRef, Get, Inject } from '@nestjs/common';
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
    const dedicated = await this.financesService.getAll();
    if (dedicated.length > 0) {
      return {
        status: false,
        data: dedicated,
      };
    }
    return {
      status: true,
      data: dedicated,
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
