import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HolidaysDocument = Holiday & Document;

@Schema()
export class Holiday {
  @Prop({ unique: true })
  date: string;
}

export const HolidaysSchema = SchemaFactory.createForClass(Holiday);
