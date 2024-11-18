import { MigrationInterface, QueryRunner } from "typeorm";

export class Addsalarytofinances1713800106078 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO finances 
        (id, name, colour, amount, dynamicPot) VALUES 
        ('0', 'Salary', '#008000', 0, 0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM finances WHERE name = 'Salary'`);
    }

}
