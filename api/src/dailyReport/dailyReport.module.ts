import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyReportController } from './dailyReport.controller';
import { DailyReportService } from './dailyReport.service';
import { DailyReport, DailyReportSchema } from './schemas/dailyReport.schema';
import { MonzoModule } from 'src/monzo/monzo.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DailyReport.name, schema: DailyReportSchema }]),
    forwardRef(() => MonzoModule),
  ],
  controllers: [DailyReportController],
  providers: [DailyReportService],
  exports: [DailyReportService],
})
export class DailyReportModule {}
