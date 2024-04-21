import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DailyReport } from './schemas/dailyReport.schema';
import { StorageService } from '../storageService';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { MonzoService } from '../monzo/monzo.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DailyReportService extends StorageService<DailyReport> {
  constructor(
    @InjectRepository(DailyReport)
    private dailyReportRepository: Repository<DailyReport>,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
  ) {
    super(dailyReportRepository);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async createYesterdaysReport(): Promise<void> {
    const amountInBank = await this.monzoService.getBalance();
    const yday = moment().subtract('1', 'days');
    const model: DailyReport = {
      day: yday.date(),
      month: yday.month() + 1,
      year: yday.year(),
      amount: +(amountInBank / 100).toFixed(2),
    };
    await this.save(model);
  }

  getByDate = async (month: number, year: number, day?: number): Promise<DailyReport[]> => {
    const param = day
      ? {
        year,
        month,
        day,
      }
      : { year, month };

    return this.dailyReportRepository.findBy(param);
  };
}
