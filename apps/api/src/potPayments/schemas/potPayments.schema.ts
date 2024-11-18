import { Entity, Column, EntitySchema, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PotPayments {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column('text')
  groupId: string;

  @Column('text')
  potId: string;
}

export const PotPaymentsSchema = new EntitySchema<PotPayments>({
  name: PotPayments.name,
  target: PotPayments,
  columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid',
    },
    groupId: {
      type: String,
    },
    potId: {
      type: String,
    },
  },
});
