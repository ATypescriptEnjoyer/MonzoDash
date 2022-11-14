import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoginDocument = Login & Document;

@Schema()
export class Login {
  @Prop()
  code: string;

  @Prop()
  expiresAt: Date;

  @Prop()
  used: boolean;
}

export const LoginSchema = SchemaFactory.createForClass(Login);
