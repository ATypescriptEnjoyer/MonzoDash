/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, forwardRef, Get, Inject, Put } from '@nestjs/common';
import { DashService } from './dash.service';
import { MonzoService } from '../monzo/monzo.service';
import { Employer } from './schemas/employer.schema';
import { CurrentFinances } from './dash.interfaces';
import { calculatePayDay } from '../../util/calculatePayDay';
import { DedicatedFinance } from '../../../shared/interfaces/finances';
import * as moment from 'moment';

@Controller('Dash')
export class DashController {
  constructor(
    private readonly dashService: DashService,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
  ) {}

  @Get('employer')
  async getEmployer(): Promise<Employer> {
    return this.dashService.getEmployer();
  }

  @Put('employer')
  async putEmployer(@Body() employerDto: Employer) {
    return this.dashService.setEmployer(employerDto);
  }

  @Get('currentFinances')
  async currentFinances(): Promise<CurrentFinances> {
    const balance = await this.monzoService.getBalance();
    const employer = await this.dashService.getEmployer();
    const payDate = await calculatePayDay(employer.payDay);

    const daysUntil = moment(payDate).diff(moment(), 'days');

    return {
      balancePence: balance,
      daysTilPay: daysUntil,
      perDayPence: balance / daysUntil,
    };
  }

  @Get('dedicatedspending')
  async dedicatedSpending(): Promise<{ status: boolean; data: DedicatedFinance[] }> {}
}
