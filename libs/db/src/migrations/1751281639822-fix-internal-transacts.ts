import { MigrationInterface, QueryRunner } from "typeorm";

export class FixInternalTransacts1751281639822 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE transactions 
            SET internal = 1 
            WHERE (transactions.description LIKE '%Withdrawal from%' OR transactions.description LIKE '%Deposit to%')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE transactions 
            SET internal = 0 
            WHERE (transactions.description LIKE '%Withdrawal from%' OR transactions.description LIKE '%Deposit to%')
        `);
    }

}
