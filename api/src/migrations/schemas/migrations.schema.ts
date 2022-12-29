import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MigrationsDocument = Migrations & Document;

@Schema()
export class Migrations {
  @Prop()
  migration: string;

  @Prop()
  date_ran: Date;
}

export const MigrationsSchema = SchemaFactory.createForClass(Migrations);
