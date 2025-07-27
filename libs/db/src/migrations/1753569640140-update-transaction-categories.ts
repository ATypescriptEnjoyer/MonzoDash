import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTransactionCategories1753569640140 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE transactions SET category = "transaction"->>'category' WHERE category IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE transactions SET category = NULL where created > '2025-06-01'`);
    }

}
