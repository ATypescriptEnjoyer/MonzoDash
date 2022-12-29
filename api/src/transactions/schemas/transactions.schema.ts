import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

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

  @Prop()
  internal?: boolean;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  transaction?: any;
}

export const TransactionsSchema = SchemaFactory.createForClass(Transactions);
