import { MigrationInterface, QueryRunner } from 'typeorm';

export class Switchfinanceamounttodecimal1713802505637 implements MigrationInterface {
  name = 'Switchfinanceamounttodecimal1713802505637';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_finances" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "colour" varchar NOT NULL, "amount" decimal NOT NULL, "dynamicPot" boolean NOT NULL DEFAULT (0))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_finances"("id", "name", "colour", "amount", "dynamicPot") SELECT "id", "name", "colour", "amount", "dynamicPot" FROM "finances"`,
    );
    await queryRunner.query(`DROP TABLE "finances"`);
    await queryRunner.query(`ALTER TABLE "temporary_finances" RENAME TO "finances"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_finances" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "colour" varchar NOT NULL, "amount" integer NOT NULL, "dynamicPot" boolean NOT NULL DEFAULT (0))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_finances"("id", "name", "colour", "amount", "dynamicPot") SELECT "id", "name", "colour", "amount", "dynamicPot" FROM "finances"`,
    );
    await queryRunner.query(`DROP TABLE "finances"`);
    await queryRunner.query(`ALTER TABLE "temporary_finances" RENAME TO "finances"`);
  }
}
