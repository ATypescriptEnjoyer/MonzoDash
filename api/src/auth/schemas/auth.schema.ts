import { Entity, Column, EntitySchema, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Auth {

  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  authToken: string;

  @Column()
  refreshToken: string;

  @Column()
  createdAt: string;

  @Column()
  expiresIn: string;

  @Column()
  twoFactored: boolean;
}

export const AuthSchema = new EntitySchema<Auth>({
  name: Auth.name, target: Auth, columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid'
    },
    authToken: {
      type: String,
    },
    refreshToken: {
      type: String
    },
    createdAt: {
      type: String
    },
    expiresIn: {
      type: String
    },
    twoFactored: {
      type: Boolean
    }
  }
});
