import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DailyReportDocument = DailyReport & Document;

@Schema()
export class DailyReport {
  @Prop()
  day: number;

  @Prop()
  month: number;

  @Prop()
  year: number;

  @Prop()
  amount: number;
}

export const DailyReportSchema = SchemaFactory.createForClass(DailyReport);
