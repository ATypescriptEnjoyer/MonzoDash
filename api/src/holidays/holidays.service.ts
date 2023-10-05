import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Holiday, HolidaysDocument } from './schemas/holidays.schema';
import { StorageService } from '../storageService';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import async from 'async';

@Injectable()
export class HolidaysService extends StorageService<Holiday> {
  constructor(@InjectModel(Holiday.name) private holidaysModel: Model<HolidaysDocument>) {
    super(holidaysModel);
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async updateStoredHolidays(): Promise<void> {
    const currentStoredHolidays = await this.getAll();
    const oldHolidays = currentStoredHolidays.filter((holiday) => moment(holiday.date).isBefore(moment()));
    await async.eachSeries(oldHolidays, async (holiday) => await this.delete(holiday));
    console.log(`${oldHolidays.length} old holidays removed.`);
    if (currentStoredHolidays.length - oldHolidays.length !== 0) {
      return;
    }
    console.log('Holidays need regenerating.');
    const { data } = await axios.get('https://www.gov.uk/bank-holidays.json');
    const holArr: Holiday[] = data['england-and-wales']['events'];
    const holidays = await this.createBulk(holArr.filter((holiday) => moment(holiday.date).isAfter(moment())));

    console.log(`${holidays.length} inserted!`);
  }

  createBulk = async (obj: Holiday[]): Promise<Holiday[]> => {
    return await this.holidaysModel.insertMany(obj);
  };
}
