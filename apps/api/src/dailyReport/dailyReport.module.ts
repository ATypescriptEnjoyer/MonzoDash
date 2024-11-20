import { forwardRef, Module } from '@nestjs/common';
import { DailyReportController } from './dailyReport.controller';
import { DailyReportService } from './dailyReport.service';
import { DailyReportSchema } from './schemas/dailyReport.schema';
import { MonzoModule } from '../monzo/monzo.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DailyReportSchema]), forwardRef(() => MonzoModule)],
  controllers: [DailyReportController],
  providers: [DailyReportService],
  exports: [DailyReportService],
})
export class DailyReportModule {}
