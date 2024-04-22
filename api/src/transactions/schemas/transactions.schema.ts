import { Entity, Column, EntitySchema, PrimaryColumn } from 'typeorm';

@Entity()
export class Transactions {
  @PrimaryColumn()
  id: string;

  @Column()
  created: string;

  @Column()
  logoUrl?: string;

  @Column()
  amount: number;

  @Column()
  type: 'incoming' | 'outgoing';

  @Column()
  description: string;

  @Column()
  internal?: boolean;

  @Column({ type: 'json' })
  transaction?: any;
}

export const TransactionsSchema = new EntitySchema<Transactions>({
  name: Transactions.name, target: Transactions, columns: {
    id: {
      type: String,
      primary: true,
    },
    created: {
      type: Date,
      default: "current_timestamp"
    },
    logoUrl: {
      type: String,
      default: ''
    },
    amount: {
      type: 'decimal',
    },
    type: {
      type: String,
      enum: ['incoming', 'outgoing']
    },
    description: {
      type: String
    },
    internal: {
      type: Boolean,
      default: false
    },
    transaction: {
      type: 'json'
    }
  }
})
