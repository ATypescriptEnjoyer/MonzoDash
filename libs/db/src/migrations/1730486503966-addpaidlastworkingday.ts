import { MigrationInterface, QueryRunner } from 'typeorm';

export class Addpaidlastworkingday1730486503966 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE employer ADD COLUMN paidLastWorkingDay boolean NOT NULL DEFAULT (0);'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE employer DROP COLUMN paidLastWorkingDay;'
    );
  }
}
