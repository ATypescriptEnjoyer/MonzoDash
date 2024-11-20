import { MigrationInterface, QueryRunner } from 'typeorm';

export class Addpaidonholidaysbooleantoemployer1713826839549 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE employer ADD COLUMN paidOnHolidays boolean NOT NULL DEFAULT (0);');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE employer DROP COLUMN paidOnHolidays;');
  }
}
