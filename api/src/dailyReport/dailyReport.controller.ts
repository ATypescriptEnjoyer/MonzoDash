/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param } from '@nestjs/common';
import { DailyReportService } from './dailyReport.service';
import { DailyReport } from './schemas/dailyReport.schema';

interface ReportData { month: number; year: number; data: { [k: number]: number } }

@Controller('daily-report')
export class DailyReportController {
  constructor(private readonly dailyReportService: DailyReportService) { }

  @Get('by-date/:year/:month')
  async byDate(@Param('year') year: number, @Param('month') month: number): Promise<ReportData> {
    const reportData = await this.dailyReportService.getByDate(month, year);
    const mappedData = reportData.reduce((prev, curr) => ({[curr.day]: curr.amount}), {});

    return {
      year,
      month,
      data: mappedData
    }
  }
}
