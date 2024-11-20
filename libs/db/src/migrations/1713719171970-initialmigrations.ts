import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initialmigrations1713719171970 implements MigrationInterface {
  name = 'Initialmigrations1713719171970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" varchar PRIMARY KEY NOT NULL, "created" varchar NOT NULL, "logoUrl" varchar NOT NULL, "amount" integer NOT NULL, "type" varchar NOT NULL, "description" varchar NOT NULL, "internal" boolean NOT NULL, "transaction" json NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "employer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "payDay" integer NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "login" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "code" varchar NOT NULL, "createdAt" varchar NOT NULL, "expiresAt" varchar NOT NULL, "used" boolean NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "holiday" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" varchar NOT NULL, CONSTRAINT "UQ_89b26e4ed3db8895b86c8df55e8" UNIQUE ("date"))`
    );
    await queryRunner.query(
      `CREATE TABLE "auth" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "authToken" varchar NOT NULL, "refreshToken" varchar NOT NULL, "createdAt" varchar NOT NULL, "expiresIn" varchar NOT NULL, "twoFactored" boolean NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "finances" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "colour" varchar NOT NULL, "amount" integer NOT NULL, "dynamicPot" boolean NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "daily_report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "day" integer NOT NULL, "month" integer NOT NULL, "year" integer NOT NULL, "amount" integer NOT NULL)`
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
    await queryRunner.query(
      `CREATE TABLE "temporary_login" ("id" varchar PRIMARY KEY NOT NULL, "code" varchar(6) NOT NULL, "createdAt" datetime NOT NULL DEFAULT ('current_timestamp'), "expiresAt" datetime NOT NULL, "used" boolean NOT NULL DEFAULT (0))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_login"("id", "code", "createdAt", "expiresAt", "used") SELECT "id", "code", "createdAt", "expiresAt", "used" FROM "login"`
    );
    await queryRunner.query(`DROP TABLE "login"`);
    await queryRunner.query(`ALTER TABLE "temporary_login" RENAME TO "login"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_holiday" ("id" varchar PRIMARY KEY NOT NULL, "date" datetime NOT NULL, CONSTRAINT "UQ_89b26e4ed3db8895b86c8df55e8" UNIQUE ("date"))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_holiday"("id", "date") SELECT "id", "date" FROM "holiday"`
    );
    await queryRunner.query(`DROP TABLE "holiday"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_holiday" RENAME TO "holiday"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_finances" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "colour" varchar NOT NULL, "amount" integer NOT NULL, "dynamicPot" boolean NOT NULL DEFAULT (0))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_finances"("id", "name", "colour", "amount", "dynamicPot") SELECT "id", "name", "colour", "amount", "dynamicPot" FROM "finances"`
    );
    await queryRunner.query(`DROP TABLE "finances"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_finances" RENAME TO "finances"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_employer" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "payDay" varchar NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_employer"("id", "name", "payDay") SELECT "id", "name", "payDay" FROM "employer"`
    );
    await queryRunner.query(`DROP TABLE "employer"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_employer" RENAME TO "employer"`
    );
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
      `CREATE TABLE "temporary_auth" ("id" varchar PRIMARY KEY NOT NULL, "authToken" varchar NOT NULL, "refreshToken" varchar NOT NULL, "createdAt" varchar NOT NULL, "expiresIn" varchar NOT NULL, "twoFactored" boolean NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_auth"("id", "authToken", "refreshToken", "createdAt", "expiresIn", "twoFactored") SELECT "id", "authToken", "refreshToken", "createdAt", "expiresIn", "twoFactored" FROM "auth"`
    );
    await queryRunner.query(`DROP TABLE "auth"`);
    await queryRunner.query(`ALTER TABLE "temporary_auth" RENAME TO "auth"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "auth" RENAME TO "temporary_auth"`);
    await queryRunner.query(
      `CREATE TABLE "auth" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "authToken" varchar NOT NULL, "refreshToken" varchar NOT NULL, "createdAt" varchar NOT NULL, "expiresIn" varchar NOT NULL, "twoFactored" boolean NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "auth"("id", "authToken", "refreshToken", "createdAt", "expiresIn", "twoFactored") SELECT "id", "authToken", "refreshToken", "createdAt", "expiresIn", "twoFactored" FROM "temporary_auth"`
    );
    await queryRunner.query(`DROP TABLE "temporary_auth"`);
    await queryRunner.query(
      `ALTER TABLE "daily_report" RENAME TO "temporary_daily_report"`
    );
    await queryRunner.query(
      `CREATE TABLE "daily_report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "day" integer NOT NULL, "month" integer NOT NULL, "year" integer NOT NULL, "amount" integer NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "daily_report"("id", "day", "month", "year", "amount") SELECT "id", "day", "month", "year", "amount" FROM "temporary_daily_report"`
    );
    await queryRunner.query(`DROP TABLE "temporary_daily_report"`);
    await queryRunner.query(
      `ALTER TABLE "employer" RENAME TO "temporary_employer"`
    );
    await queryRunner.query(
      `CREATE TABLE "employer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "payDay" integer NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "employer"("id", "name", "payDay") SELECT "id", "name", "payDay" FROM "temporary_employer"`
    );
    await queryRunner.query(`DROP TABLE "temporary_employer"`);
    await queryRunner.query(
      `ALTER TABLE "finances" RENAME TO "temporary_finances"`
    );
    await queryRunner.query(
      `CREATE TABLE "finances" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "colour" varchar NOT NULL, "amount" integer NOT NULL, "dynamicPot" boolean NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "finances"("id", "name", "colour", "amount", "dynamicPot") SELECT "id", "name", "colour", "amount", "dynamicPot" FROM "temporary_finances"`
    );
    await queryRunner.query(`DROP TABLE "temporary_finances"`);
    await queryRunner.query(
      `ALTER TABLE "holiday" RENAME TO "temporary_holiday"`
    );
    await queryRunner.query(
      `CREATE TABLE "holiday" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" varchar NOT NULL, CONSTRAINT "UQ_89b26e4ed3db8895b86c8df55e8" UNIQUE ("date"))`
    );
    await queryRunner.query(
      `INSERT INTO "holiday"("id", "date") SELECT "id", "date" FROM "temporary_holiday"`
    );
    await queryRunner.query(`DROP TABLE "temporary_holiday"`);
    await queryRunner.query(`ALTER TABLE "login" RENAME TO "temporary_login"`);
    await queryRunner.query(
      `CREATE TABLE "login" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "code" varchar NOT NULL, "createdAt" varchar NOT NULL, "expiresAt" varchar NOT NULL, "used" boolean NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "login"("id", "code", "createdAt", "expiresAt", "used") SELECT "id", "code", "createdAt", "expiresAt", "used" FROM "temporary_login"`
    );
    await queryRunner.query(`DROP TABLE "temporary_login"`);
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME TO "temporary_transactions"`
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" varchar PRIMARY KEY NOT NULL, "created" varchar NOT NULL, "logoUrl" varchar NOT NULL, "amount" integer NOT NULL, "type" varchar NOT NULL, "description" varchar NOT NULL, "internal" boolean NOT NULL, "transaction" json NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "transactions"("id", "created", "logoUrl", "amount", "type", "description", "internal", "transaction") SELECT "id", "created", "logoUrl", "amount", "type", "description", "internal", "transaction" FROM "temporary_transactions"`
    );
    await queryRunner.query(`DROP TABLE "temporary_transactions"`);
    await queryRunner.query(`DROP TABLE "daily_report"`);
    await queryRunner.query(`DROP TABLE "finances"`);
    await queryRunner.query(`DROP TABLE "auth"`);
    await queryRunner.query(`DROP TABLE "holiday"`);
    await queryRunner.query(`DROP TABLE "login"`);
    await queryRunner.query(`DROP TABLE "employer"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
  }
}
