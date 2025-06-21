import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrateFinancesAmountToFinancesItem1750017432003 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO finance_item (id, name, amount, finance_id)
            SELECT hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-' || substr('89ab', abs(random() % 4) + 1, 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6)), name, amount, id FROM finances
        `);
        await queryRunner.query(`
            ALTER TABLE finances DROP COLUMN amount
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE finances ADD COLUMN amount INTEGER;
        `);
        await queryRunner.query(`
            UPDATE finances SET amount = (
                SELECT SUM(amount) FROM finance_item WHERE finance_id = finances.id
            )
        `);
    }

}
