import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFinanceItemTable1750016529206 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE finance_item (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255),
                amount INTEGER,
                finance_id VARCHAR(36),
                CONSTRAINT fk_finance_item_finance FOREIGN KEY (finance_id) REFERENCES finances(id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE finance_item
        `);
    }

}
