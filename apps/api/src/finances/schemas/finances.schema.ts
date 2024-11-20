import { Entity, Column, EntitySchema, PrimaryColumn } from 'typeorm';

@Entity()
export class Finances {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  colour: string;

  @Column()
  amount: number;

  @Column()
  dynamicPot?: boolean = false;
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
    amount: {
      type: 'decimal',
    },
    dynamicPot: {
      type: Boolean,
      default: false,
    },
  },
});
