import { Entity, Column, EntitySchema, PrimaryGeneratedColumn } from 'typeorm';

const dateTransformer = {
  from: (value: string) => new Date(value),
  to: (value: Date) => value.toISOString(),
};

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  authToken: string;

  @Column()
  refreshToken: string;

  @Column({ transformer: dateTransformer })
  createdAt: Date;

  @Column({ transformer: dateTransformer })
  expiresIn: Date;

  @Column()
  twoFactored: boolean;
}

export const AuthSchema = new EntitySchema<Auth>({
  name: Auth.name,
  target: Auth,
  columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid',
    },
    authToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    expiresIn: {
      type: Date,
    },
    twoFactored: {
      type: Boolean,
    },
  },
});
