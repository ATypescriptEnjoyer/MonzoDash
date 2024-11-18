import { Module } from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { HolidaysSchema } from './schemas/holidays.schema';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([HolidaysSchema])],
  controllers: [],
  providers: [HolidaysService],
  exports: [HolidaysService],
})
export class HolidaysModule { }
