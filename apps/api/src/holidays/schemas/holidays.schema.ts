import { Entity, Column, EntitySchema, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Holiday {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  date: string;
}

export const HolidaysSchema = new EntitySchema<Holiday>({
  name: Holiday.name,
  target: Holiday,
  columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid',
    },
    date: {
      type: Date,
      unique: true,
    },
  },
});
