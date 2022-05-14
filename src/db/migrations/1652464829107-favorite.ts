import { MigrationInterface, QueryRunner } from "typeorm";

export class favorite1652464829107 implements MigrationInterface {
    name = 'favorite1652464829107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_favorite_track" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "AddedAt" datetime NOT NULL DEFAULT (datetime('now')), "trackName" varchar, "trackArtistName" varchar, CONSTRAINT "REL_d92b2ef036f5bdbb7fe3d4fbfe" UNIQUE ("trackName", "trackArtistName"), CONSTRAINT "FK_d92b2ef036f5bdbb7fe3d4fbfe8" FOREIGN KEY ("trackName", "trackArtistName") REFERENCES "track" ("Name", "artistName") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_favorite_track"("Id", "AddedAt", "trackName", "trackArtistName") SELECT "Id", "CreatedAt", "trackName", "trackArtistName" FROM "favorite_track"`);
        await queryRunner.query(`DROP TABLE "favorite_track"`);
        await queryRunner.query(`ALTER TABLE "temporary_favorite_track" RENAME TO "favorite_track"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite_track" RENAME TO "temporary_favorite_track"`);
        await queryRunner.query(`CREATE TABLE "favorite_track" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "CreatedAt" datetime NOT NULL DEFAULT (datetime('now')), "trackName" varchar, "trackArtistName" varchar, CONSTRAINT "REL_d92b2ef036f5bdbb7fe3d4fbfe" UNIQUE ("trackName", "trackArtistName"), CONSTRAINT "FK_d92b2ef036f5bdbb7fe3d4fbfe8" FOREIGN KEY ("trackName", "trackArtistName") REFERENCES "track" ("Name", "artistName") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "favorite_track"("Id", "CreatedAt", "trackName", "trackArtistName") SELECT "Id", "AddedAt", "trackName", "trackArtistName" FROM "temporary_favorite_track"`);
        await queryRunner.query(`DROP TABLE "temporary_favorite_track"`);
    }

}
