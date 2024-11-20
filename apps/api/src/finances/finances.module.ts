import { forwardRef, Module } from '@nestjs/common';
import { HolidaysModule } from '../holidays/holidays.module';
import { EmployerModule } from '../employer/employer.module';
import { MonzoModule } from '../monzo/monzo.module';
import { FinancesController } from './finances.controller';
import { FinancesService } from './finances.service';
import { FinancesSchema } from './schemas/finances.schema';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FinancesSchema]), EmployerModule, forwardRef(() => MonzoModule), HolidaysModule],
  controllers: [FinancesController],
  providers: [FinancesService],
  exports: [FinancesService],
})
export class FinancesModule {}
