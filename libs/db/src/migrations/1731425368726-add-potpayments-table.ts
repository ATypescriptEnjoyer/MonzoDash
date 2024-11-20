import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPotpaymentsTable1731425368726 implements MigrationInterface {
  name = 'AddPotpaymentsTable1731425368726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pot_payments" ("id" varchar PRIMARY KEY NOT NULL, "groupId" varchar NOT NULL, "potId" varchar NOT NULL)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "pot_payments"`);
  }
}
