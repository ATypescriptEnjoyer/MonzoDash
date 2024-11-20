import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGroupIdToTransactions1731426065516
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE transactions ADD COLUMN groupId varchar NOT NULL DEFAULT ('');"
    );
    queryRunner.query(`
        UPDATE transactions
        SET groupId = innerTransact.jsonGrp
        FROM (SELECT id, coalesce(json_extract("transaction", '$.merchant.group_id'), '') AS jsonGrp from transactions) AS innerTransact
        WHERE transactions.id = innerTransact.id;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE transactions DROP COLUMN groupId;');
  }
}
