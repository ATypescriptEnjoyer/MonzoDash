import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionsDocument = Transactions & Document;

@Schema()
export class Transactions {
  @Prop()
  id: string;

  @Prop()
  created: Date;

  @Prop()
  logoUrl?: string;

  @Prop()
  amount: number;

  @Prop()
  type: 'incoming' | 'outgoing';

  @Prop()
  description: string;
}

export const TransactionsSchema = SchemaFactory.createForClass(Transactions);
