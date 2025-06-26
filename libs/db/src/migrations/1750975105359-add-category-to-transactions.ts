import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCategoryToTransactions1750975105359 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('transactions', new TableColumn({
            name: 'category',
            type: 'varchar',
            isNullable: true,
            default: null,
        }));

        await queryRunner.query(`UPDATE transactions SET category = "transaction"->>'category'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('transactions', 'category');
    }

}
