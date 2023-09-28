/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param } from '@nestjs/common';
import { DailyReportService } from './dailyReport.service';
import { DailyReport } from './schemas/dailyReport.schema';

@Controller('DailyReport')
export class DailyReportController {
  constructor(private readonly dailyReportService: DailyReportService) {}

  @Get('by-date/:year/:month')
  async byDate(@Param('year') year: number, @Param('month') month: number): Promise<DailyReport[]> {
    return this.dailyReportService.getByDate(month, year);
  }
}
