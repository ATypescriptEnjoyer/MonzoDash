import { MigrationInterface, QueryRunner } from 'typeorm';

export class Updateamountstodecimal1713803993605 implements MigrationInterface {
  name = 'Updateamountstodecimal1713803993605';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_daily_report" ("id" varchar PRIMARY KEY NOT NULL, "day" integer NOT NULL, "month" integer NOT NULL, "year" integer NOT NULL, "amount" decimal NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_daily_report"("id", "day", "month", "year", "amount") SELECT "id", "day", "month", "year", "amount" FROM "daily_report"`
    );
    await queryRunner.query(`DROP TABLE "daily_report"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_daily_report" RENAME TO "daily_report"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_transactions" ("id" varchar PRIMARY KEY NOT NULL, "created" datetime NOT NULL DEFAULT ('current_timestamp'), "logoUrl" varchar NOT NULL DEFAULT (''), "amount" decimal NOT NULL, "type" varchar NOT NULL, "description" varchar NOT NULL, "internal" boolean NOT NULL DEFAULT (0), "transaction" json NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transactions"("id", "created", "logoUrl", "amount", "type", "description", "internal", "transaction") SELECT "id", "created", "logoUrl", "amount", "type", "description", "internal", "transaction" FROM "transactions"`
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_transactions" RENAME TO "transactions"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_daily_report" ("id" varchar PRIMARY KEY NOT NULL, "day" integer NOT NULL, "month" integer NOT NULL, "year" integer NOT NULL, "amount" integer NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_daily_report"("id", "day", "month", "year", "amount") SELECT "id", "day", "month", "year", "amount" FROM "daily_report"`
    );
    await queryRunner.query(`DROP TABLE "daily_report"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_daily_report" RENAME TO "daily_report"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_transactions" ("id" varchar PRIMARY KEY NOT NULL, "created" datetime NOT NULL DEFAULT ('current_timestamp'), "logoUrl" varchar NOT NULL DEFAULT (''), "amount" integer NOT NULL, "type" varchar NOT NULL, "description" varchar NOT NULL, "internal" boolean NOT NULL DEFAULT (0), "transaction" json NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transactions"("id", "created", "logoUrl", "amount", "type", "description", "internal", "transaction") SELECT "id", "created", "logoUrl", "amount", "type", "description", "internal", "transaction" FROM "transactions"`
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_transactions" RENAME TO "transactions"`
    );
  }
}
