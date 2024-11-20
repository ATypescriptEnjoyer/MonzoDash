import { Entity, Column, EntitySchema, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DailyReport {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  day: number;

  @Column()
  month: number;

  @Column()
  year: number;

  @Column()
  amount: number;
}

export const DailyReportSchema = new EntitySchema<DailyReport>({
  name: DailyReport.name,
  target: DailyReport,
  columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid',
    },
    day: {
      type: Number,
    },
    month: {
      type: Number,
    },
    year: {
      type: Number,
    },
    amount: {
      type: 'decimal',
    },
  },
});
