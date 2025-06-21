import { Entity, Column, EntitySchema, PrimaryColumn, OneToMany, JoinColumn, ManyToOne, JoinTable, PrimaryGeneratedColumn } from 'typeorm';

@Entity('finances')
export class Finances {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  colour: string;

  @OneToMany(() => FinanceItem, (item) => item.finances, {
    nullable: true,
    cascade: true,
  })
  @JoinTable({
    name: 'finance_finance_items',
    joinColumn: { name: 'finance_id', referencedColumnName: 'id' },
  })
  items: FinanceItem[];

  @Column()
  dynamicPot?: boolean = false;
}

@Entity('finance_item')
export class FinanceItem {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  amount: number;

  @Column({ name: 'finance_id' })
  financeId: string;

  @ManyToOne(() => Finances, (finances) => finances.items)
  @JoinColumn({ name: 'finance_id' })
  finances: Finances;
}

export const FinancesSchema = new EntitySchema<Finances>({
  name: Finances.name,
  target: Finances,
  columns: {
    id: {
      type: String,
      primary: true,
    },
    name: {
      type: String,
    },
    colour: {
      type: String,
    },
    dynamicPot: {
      type: Boolean,
      default: false,
    },
  },
  relations: {
    items: {
      type: 'one-to-many',
      target: 'FinanceItem',
      inverseSide: 'finances',
    },
  },
});

export const FinanceItemSchema = new EntitySchema<FinanceItem>({
  name: FinanceItem.name,
  target: FinanceItem,
  columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: String,
    },
    amount: {
      type: 'decimal',
    },
    financeId: {
      type: String,
      name: 'finance_id',
    },
  },
  relations: {
    finances: {
      type: 'many-to-one',
      target: 'Finances',
      inverseSide: 'items',
      joinColumn: {
        name: 'finance_id',
      },
    },
  },
});
