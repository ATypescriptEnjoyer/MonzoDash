import { dateTransformer } from '../../transformers/dateTransformer';
import { Entity, Column, EntitySchema, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Login {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  code: string;

  @Column({ transformer: dateTransformer })
  createdAt: Date;

  @Column({ transformer: dateTransformer })
  expiresAt: Date;

  @Column()
  used: boolean;
}

export const LoginSchema = new EntitySchema<Login>({
  name: Login.name,
  target: Login,
  columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid',
    },
    code: {
      type: String,
      length: 6,
    },
    createdAt: {
      type: Date,
      default: 'current_timestamp',
    },
    expiresAt: {
      type: Date,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
});
