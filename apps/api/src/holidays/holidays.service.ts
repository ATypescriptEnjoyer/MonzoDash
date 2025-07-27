import { Injectable, Logger } from '@nestjs/common';
import { Holiday } from './schemas/holidays.schema';
import { StorageService } from '../storageService';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';
import async from 'async';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class HolidaysService extends StorageService<Holiday> {
  private readonly logger = new Logger(HolidaysService.name);
  constructor(
    @InjectRepository(Holiday)
    holidayRepository: Repository<Holiday>,
  ) {
    super(holidayRepository);
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async updateStoredHolidays(): Promise<void> {
    const currentStoredHolidays = await this.getAll();
    const oldHolidays = currentStoredHolidays.filter((holiday) => dayjs(holiday.date).isBefore(dayjs()));
    await async.eachSeries(oldHolidays, async (holiday) => await this.delete(holiday));
    this.logger.log(`${oldHolidays.length} old holidays removed.`);
    if (currentStoredHolidays.length - oldHolidays.length !== 0) {
      return;
    }
    this.logger.log('Holidays need regenerating.');
    const { data } = await axios.get('https://www.gov.uk/bank-holidays.json');
    const holArr: Holiday[] = data['england-and-wales']['events'];
    const holidays = await this.createBulk(holArr.filter((holiday) => dayjs(holiday.date).isAfter(dayjs())));

    this.logger.log(`${holidays.length} inserted!`);
  }

  createBulk = async (obj: Holiday[]): Promise<Holiday[]> => {
    return this.save(obj);
  };
}
