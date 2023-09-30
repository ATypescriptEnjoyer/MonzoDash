import { Model, Document } from 'mongoose';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DailyReport, DailyReportDocument } from './schemas/dailyReport.schema';
import { StorageService } from '../storageService';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { MonzoService } from 'src/monzo/monzo.service';

@Injectable()
export class DailyReportService extends StorageService<DailyReport> {
  constructor(
    @InjectModel(DailyReport.name) private dailyReportModel: Model<DailyReportDocument>,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
  ) {
    super(dailyReportModel);
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
    await this.dailyReportModel.create(model);
  }

  getByDate = async (month: number, year: number, day?: number): Promise<(DailyReport & Document)[]> => {
    const param = day
      ? {
          year,
          month,
          day,
        }
      : { year, month };

    return await this.dailyReportModel.find(param).exec();
  };
}
