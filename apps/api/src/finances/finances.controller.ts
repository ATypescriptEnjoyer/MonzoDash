import { Body, Controller, forwardRef, Get, HttpException, HttpStatus, Inject, Post } from '@nestjs/common';
import dayjs from 'dayjs';
import { CurrentFinances } from './finances.interfaces';
import { calculatePayDay } from '../util/calculatePayDay';
import { EmployerService } from '../employer/employer.service';
import { MonzoService } from '../monzo/monzo.service';
import { FinancesService } from './finances.service';
import { HolidaysService } from '../holidays/holidays.service';
import { Holiday } from '../holidays/schemas/holidays.schema';
import axios from 'axios';
import { Finances } from './schemas/finances.schema';

@Controller('finances')
export class FinancesController {
  constructor(
    private readonly financesService: FinancesService,
    private readonly employerService: EmployerService,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
    private readonly holidaysService: HolidaysService,
  ) {}

  @Get()
  async dedicatedFinances(): Promise<Finances[]> {
    const dedicated = await this.financesService.getOrderedFinances();
    if (dedicated.length > 0) {
      return dedicated;
    }
    const monzoPots = await this.monzoService.getPots();
    return [
      ...dedicated,
      ...monzoPots.map(({ id, name }) => ({ id, name, amount: 0, colour: '#FFFFFF', dynamicPot: false })),
    ];
  }

  @Post()
  async postDedicatedFinances(@Body() dedicatedDto: Finances[]): Promise<{ status: boolean; data: Finances[] }> {
    const financePromises = dedicatedDto.map(async (value: Finances) => {
      return this.financesService.save(value);
    });
    const finances = await Promise.all(financePromises);

    return {
      status: true,
      data: finances,
    };
  }

  @Get('current')
  async currentFinances(): Promise<CurrentFinances> {
    const balance = await this.monzoService.getBalance().catch((err) => {
      if (axios.isAxiosError(err)) {
        if (err.status === 403) {
          return new HttpException('Forbidden', HttpStatus.FORBIDDEN); //Pass 403 to frontend
        }
      }
      return err;
    });
    if (typeof balance !== 'number') {
      // Must be exception
      throw balance;
    }
    const employerArr = await this.employerService.getAll();
    if (employerArr.length > 0) {
      const employer = employerArr[0];
      const holidays: Holiday[] = await this.holidaysService.getAll();
      const payDate = await calculatePayDay(
        employer.payDay,
        holidays,
        new Date(),
        employer.paidOnHolidays,
        employer.paidLastWorkingDay,
      );
      let daysUntil = dayjs(payDate).diff(dayjs(), 'days');
      if (daysUntil === 0) {
        payDate.setDate(employer.payDay);
        const nextPayday = await calculatePayDay(
          employer.payDay,
          holidays,
          payDate,
          employer.paidOnHolidays,
          employer.paidLastWorkingDay,
        );
        daysUntil = dayjs(nextPayday).diff(dayjs(), 'days');
      }

      return {
        balancePence: balance,
        daysTilPay: daysUntil,
        perDayPence: balance / daysUntil,
      };
    }

    const daysUntil = 28 - new Date().getDate();

    return {
      balancePence: balance,
      daysTilPay: daysUntil,
      perDayPence: balance / daysUntil,
    };
  }
}
