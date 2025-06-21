import { MigrationInterface, QueryRunner } from "typeorm";

export class MoveSalaryFromFinances1750023732968 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE employer ADD COLUMN salary integer NOT NULL DEFAULT 0;
        `);

        await queryRunner.query(`
            UPDATE employer SET salary = (SELECT coalesce(SUM(amount), 0) FROM finance_item WHERE finance_id = '0');
        `);

        await queryRunner.query(`
            DELETE FROM finance_item WHERE finance_id = '0';
        `);

        await queryRunner.query(`
            DELETE FROM finances WHERE id = '0';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO finances (id, name, colour, dynamicPot)
            VALUES ('0', 'Salary', '#000000', 0);
        `);

        await queryRunner.query(`
            INSERT INTO finance_item (id, name, amount, finance_id)
            VALUES (hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-' || substr('89ab', abs(random() % 4) + 1, 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6)), 'Salary', coalesce((SELECT salary FROM employer limit 1), 0), '0');
        `);

        await queryRunner.query(`
            ALTER TABLE employer DROP COLUMN salary;
        `);
    }

}
