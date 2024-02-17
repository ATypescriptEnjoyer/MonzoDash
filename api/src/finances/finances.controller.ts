/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, forwardRef, Get, HttpException, HttpStatus, Inject, Post } from '@nestjs/common';
import * as moment from 'moment';
import { CurrentFinances, DedicatedFinance } from '../../../shared/interfaces/finances';
import { calculatePayDay } from '../util/calculatePayDay';
import { EmployerService } from '../employer/employer.service';
import { MonzoService } from '../monzo/monzo.service';
import { FinancesService } from './finances.service';
import { HolidaysService } from '../holidays/holidays.service';
import { Holiday } from '../holidays/schemas/holidays.schema';
import axios, { AxiosError } from 'axios';
@Controller('Finances')
export class FinancesController {
  constructor(
    private readonly financesService: FinancesService,
    private readonly employerService: EmployerService,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
    private readonly holidaysService: HolidaysService,
  ) { }

  @Get('dedicated')
  async dedicatedFinances(): Promise<DedicatedFinance[]> {
    const dedicated = await this.financesService.getAll();
    if (dedicated.length > 0) {
      return dedicated;
    }
    const monzoPots = await this.monzoService.getPots();
    return monzoPots.map(({ id, name }) => ({ id, name, amount: 0, colour: '#FFFFFF', dynamicPot: false }));
  }

  @Post('dedicated')
  async postDedicatedFinances(
    @Body() dedicatedDto: DedicatedFinance[],
  ): Promise<{ status: boolean; data: DedicatedFinance[] }> {
    const existingPots = await this.financesService.getAll();
    const financePromises = dedicatedDto.map(async (value: DedicatedFinance) => {
      const existingPot = existingPots.find(({ id }) => id === value.id);
      if (existingPot) {
        await existingPot.updateOne(value);
        return value;
      }
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
    let balance = 0;
    try {
      balance = await this.monzoService.getBalance();
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 403) {
          throw new HttpException('Forbidden', HttpStatus.FORBIDDEN); //Pass 403 to frontend
        }
      } else {
        throw err; //Rethrow and let sentry pick it up
      }
    }
    const employer = (await this.employerService.getAll())[0];
    if (employer) {
      const holidays: Holiday[] = await this.holidaysService.getAll();
      const payDate = await calculatePayDay(employer.payDay, holidays);
      let daysUntil = moment(payDate).diff(moment(), 'days');
      if (daysUntil === 0) {
        payDate.setDate(employer.payDay);
        const nextPayday = await calculatePayDay(employer.payDay, holidays, payDate);
        daysUntil = moment(nextPayday).diff(moment(), 'days');
      }

      return {
        balancePence: balance,
        daysTilPay: daysUntil,
        perDayPence: balance / daysUntil,
      };
    }

    return null;
  }
}
