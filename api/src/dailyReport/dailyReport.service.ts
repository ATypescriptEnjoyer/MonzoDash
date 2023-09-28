import { Model, Document } from 'mongoose';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DailyReport, DailyReportDocument } from './schemas/dailyReport.schema';
import { StorageService } from '../storageService';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class DailyReportService extends StorageService<DailyReport> {
  constructor(
    @InjectModel(DailyReport.name) private dailyReportModel: Model<DailyReportDocument>,
    @Inject(forwardRef(() => TransactionsService)) private readonly transactionsService: TransactionsService,
  ) {
    super(dailyReportModel);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async createYesterdaysReport(): Promise<void> {
    const yday = moment().subtract(1, 'days');
    const lastReportDate = moment().subtract(2, 'days');
    const lastReport = await this.getByDate(lastReportDate.month() + 1, lastReportDate.year(), lastReportDate.date());
    console.log(`Generating report for ${yday.format()}`);
    const lastValue = lastReport.length > 0 ? lastReport[0].amount : 0;
    const transactions = await this.transactionsService.getAll();
    const yesterdaysValue = transactions
      .filter((transaction) => moment(transaction.created).format('L') === yday.format('L'))
      .reduce((prev, curr) => (prev += curr.amount), 0);

    const totalValue = lastValue + yesterdaysValue;
    const model: DailyReport = {
      day: yday.date(),
      month: yday.month() + 1,
      year: yday.year(),
      amount: totalValue,
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
