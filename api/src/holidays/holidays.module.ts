import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HolidaysService } from './holidays.service';
import { Holiday, HolidaysSchema } from './schemas/holidays.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Holiday.name, schema: HolidaysSchema }])],
  controllers: [],
  providers: [HolidaysService],
  exports: [HolidaysService],
})
export class HolidaysModule {}
