import { MigrationInterface, QueryRunner } from "typeorm";

export class keyvalue1650909480664 implements MigrationInterface {
    name = 'keyvalue1650909480664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "key_value" ("key" varchar PRIMARY KEY NOT NULL, "value" varchar)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "key_value"`);
    }

}
