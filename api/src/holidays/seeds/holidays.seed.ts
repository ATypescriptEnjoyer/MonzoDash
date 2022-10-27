import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { HolidaysService } from '../holidays.service';
import axios from 'axios';
import { Holiday } from '../schemas/holidays.schema';

@Injectable()
export class HolidaysSeed {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Command({ command: 'create:holidays', describe: 'creates holidays from Gov UK' })
  async create() {
    await this.holidaysService.deleteAll();

    const { data } = await axios.get('https://www.gov.uk/bank-holidays.json');
    const holArr: Holiday[] = data['england-and-wales']['events'];
    const holidays = await this.holidaysService.createBulk(holArr);

    console.log(`${holidays.length} inserted!`);
  }
}
