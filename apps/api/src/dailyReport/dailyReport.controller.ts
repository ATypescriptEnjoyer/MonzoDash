/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DailyReportService } from './dailyReport.service';

interface ReportData {
  month: number;
  year: number;
  data: { [k: number]: number };
}

@Controller('daily-report')
export class DailyReportController {
  constructor(private readonly dailyReportService: DailyReportService) {}

  @Get('by-date/:year/:month')
  async byDate(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ): Promise<ReportData> {
    const reportData = await this.dailyReportService.getByDate(month, year);
    const mappedData = reportData.reduce((prev, curr) => ({ ...prev, [curr.day]: curr.amount }), {});

    return {
      year: year,
      month: month,
      data: mappedData,
    };
  }
}
