import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployerModule } from '../employer/employer.module';
import { MonzoModule } from '../monzo/monzo.module';
import { FinancesController } from './finances.controller';
import { FinancesService } from './finances.service';
import { Finances, FinancesSchema } from './schemas/finances.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Finances.name, schema: FinancesSchema }]),
    EmployerModule,
    forwardRef(() => MonzoModule),
  ],
  controllers: [FinancesController],
  providers: [FinancesService],
  exports: [FinancesService],
})
export class FinancesModule {}
