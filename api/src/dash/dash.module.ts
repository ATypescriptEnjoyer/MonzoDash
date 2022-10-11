import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonzoModule } from '../monzo/monzo.module';
import { DashController } from './dash.controller';
import { DashService } from './dash.service';
import { Employer, EmployerSchema } from './schemas/employer.schema';
import { Spending, SpendingSchema } from './schemas/spending.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Employer.name, schema: EmployerSchema }]),
    MongooseModule.forFeature([{ name: Spending.name, schema: SpendingSchema }]),
    forwardRef(() => MonzoModule),
  ],
  controllers: [DashController],
  providers: [DashService],
})
export class DashModule {}
