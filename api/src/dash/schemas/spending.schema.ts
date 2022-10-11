import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DedicatedFinance } from '../../../../shared/interfaces/finances';

export type SpendingDocument = DedicatedFinance & Document;

@Schema()
export class Spending {
  @Prop()
  name: string;

  @Prop()
  colour: string;

  @Prop()
  amount: number;
}

export const SpendingSchema = SchemaFactory.createForClass(Spending);
