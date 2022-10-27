import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HolidaysService } from './holidays.service';
import { Holiday, HolidaysSchema } from './schemas/holidays.schema';
import { HolidaysSeed } from './seeds/holidays.seed';

@Module({
  imports: [MongooseModule.forFeature([{ name: Holiday.name, schema: HolidaysSchema }])],
  controllers: [],
  providers: [HolidaysService, HolidaysSeed],
  exports: [HolidaysService, HolidaysSeed],
})
export class HolidaysModule {}
