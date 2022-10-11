import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployerDocument = Employer & Document;

@Schema()
export class Employer {
  @Prop()
  name: string;

  @Prop()
  payDay: number;
}

export const EmployerSchema = SchemaFactory.createForClass(Employer);
