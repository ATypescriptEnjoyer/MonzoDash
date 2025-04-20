import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRemainderPotEmployeesTable1745167432298 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE employer ADD COLUMN remainderPotId varchar");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE employer DROP COLUMN remainderPotId");
    }

}
