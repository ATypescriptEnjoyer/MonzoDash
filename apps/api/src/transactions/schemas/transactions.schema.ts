import { WebhookTransactionData } from '../../monzo/monzo.interfaces';
import { Entity, Column, EntitySchema, PrimaryColumn } from 'typeorm';

@Entity()
export class Transactions {
  @PrimaryColumn()
  id: string;

  @Column()
  created: string;

  @Column()
  logoUrl: string;

  @Column()
  amount: number;

  @Column()
  type: 'incoming' | 'outgoing';

  @Column()
  description: string;

  @Column()
  internal: boolean;

  @Column()
  groupId: string;

  @Column({ type: 'json' })
  transaction?: WebhookTransactionData;

  @Column()
  category: string | null;
}

export const TransactionsSchema = new EntitySchema<Transactions>({
  name: Transactions.name,
  target: Transactions,
  columns: {
    id: {
      type: String,
      primary: true,
    },
    created: {
      type: Date,
      default: 'current_timestamp',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    amount: {
      type: 'decimal',
    },
    type: {
      type: String,
      enum: ['incoming', 'outgoing'],
    },
    description: {
      type: String,
    },
    internal: {
      type: Boolean,
      default: false,
    },
    groupId: {
      type: String,
      default: '',
    },
    transaction: {
      type: 'json',
    },
    category: {
      type: String,
      nullable: true,
      default: null,
    },
  },
});
