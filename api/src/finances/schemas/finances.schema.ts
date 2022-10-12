import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DedicatedFinance } from '../../../../shared/interfaces/finances';

export type FinancesDocument = DedicatedFinance & Document;

@Schema()
export class Finances {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  colour: string;

  @Prop()
  amount: number;
}

export const FinancesSchema = SchemaFactory.createForClass(Finances);
