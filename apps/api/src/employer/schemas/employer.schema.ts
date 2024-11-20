import { Entity, Column, EntitySchema, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Employer {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  payDay: number;

  @Column()
  paidOnHolidays: boolean;

  @Column()
  paidLastWorkingDay: boolean;
}

export const EmployerSchema = new EntitySchema<Employer>({
  name: Employer.name, target: Employer, columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid'
    },
    name: {
      type: String
    },
    payDay: {
      type: String
    },
    paidOnHolidays: {
      type: Boolean
    },
    paidLastWorkingDay: {
      type: Boolean
    }
  }
})
