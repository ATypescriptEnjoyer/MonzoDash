import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthDocument = Auth & Document;

@Schema()
export class Auth {
  @Prop()
  authToken: string;

  @Prop()
  refreshToken: string;

  @Prop()
  expiresIn: Date;

  @Prop()
  twoFactored: boolean;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
