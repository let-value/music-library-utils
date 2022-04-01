import { MigrationInterface, QueryRunner } from "typeorm";

export class init1648842965871 implements MigrationInterface {
    name = 'init1648842965871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "playlist" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "track" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Name" varchar NOT NULL, "ISRC" varchar, "artistName" varchar, "albumId" integer)`);
        await queryRunner.query(`CREATE TABLE "artist" ("Name" varchar PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "album" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Name" varchar NOT NULL, "artistName" varchar)`);
        await queryRunner.query(`CREATE TABLE "favorite_album" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "albumId" integer, CONSTRAINT "REL_25b9b6014e56d858b32863836c" UNIQUE ("albumId"))`);
        await queryRunner.query(`CREATE TABLE "favorite_artist" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "artistName" varchar, CONSTRAINT "REL_2c049131fb3640eba6bf7fcc00" UNIQUE ("artistName"))`);
        await queryRunner.query(`CREATE TABLE "favorite_track" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "trackId" integer, CONSTRAINT "REL_8cdd0f83efe8f5df377eeab9b7" UNIQUE ("trackId"))`);
        await queryRunner.query(`CREATE TABLE "playlist_tracks_track" ("playlistId" integer NOT NULL, "trackId" integer NOT NULL, PRIMARY KEY ("playlistId", "trackId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_53e780b9e2955ef02466636cda" ON "playlist_tracks_track" ("playlistId") `);
        await queryRunner.query(`CREATE INDEX "IDX_54dd1e92dd268df3dcc0cbb643" ON "playlist_tracks_track" ("trackId") `);
        await queryRunner.query(`CREATE TABLE "temporary_track" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Name" varchar NOT NULL, "ISRC" varchar, "artistName" varchar, "albumId" integer, CONSTRAINT "FK_70f1a05b138df8f4dc908a15eb5" FOREIGN KEY ("artistName") REFERENCES "artist" ("Name") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_b105d945c4c185395daca91606a" FOREIGN KEY ("albumId") REFERENCES "album" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_track"("Id", "Name", "ISRC", "artistName", "albumId") SELECT "Id", "Name", "ISRC", "artistName", "albumId" FROM "track"`);
        await queryRunner.query(`DROP TABLE "track"`);
        await queryRunner.query(`ALTER TABLE "temporary_track" RENAME TO "track"`);
        await queryRunner.query(`CREATE TABLE "temporary_album" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Name" varchar NOT NULL, "artistName" varchar, CONSTRAINT "FK_e2bcbb6ff3ffdbbb95668233512" FOREIGN KEY ("artistName") REFERENCES "artist" ("Name") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_album"("Id", "Name", "artistName") SELECT "Id", "Name", "artistName" FROM "album"`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`ALTER TABLE "temporary_album" RENAME TO "album"`);
        await queryRunner.query(`CREATE TABLE "temporary_favorite_album" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "albumId" integer, CONSTRAINT "REL_25b9b6014e56d858b32863836c" UNIQUE ("albumId"), CONSTRAINT "FK_25b9b6014e56d858b32863836ca" FOREIGN KEY ("albumId") REFERENCES "album" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_favorite_album"("Id", "albumId") SELECT "Id", "albumId" FROM "favorite_album"`);
        await queryRunner.query(`DROP TABLE "favorite_album"`);
        await queryRunner.query(`ALTER TABLE "temporary_favorite_album" RENAME TO "favorite_album"`);
        await queryRunner.query(`CREATE TABLE "temporary_favorite_artist" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "artistName" varchar, CONSTRAINT "REL_2c049131fb3640eba6bf7fcc00" UNIQUE ("artistName"), CONSTRAINT "FK_2c049131fb3640eba6bf7fcc007" FOREIGN KEY ("artistName") REFERENCES "artist" ("Name") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_favorite_artist"("Id", "artistName") SELECT "Id", "artistName" FROM "favorite_artist"`);
        await queryRunner.query(`DROP TABLE "favorite_artist"`);
        await queryRunner.query(`ALTER TABLE "temporary_favorite_artist" RENAME TO "favorite_artist"`);
        await queryRunner.query(`CREATE TABLE "temporary_favorite_track" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "trackId" integer, CONSTRAINT "REL_8cdd0f83efe8f5df377eeab9b7" UNIQUE ("trackId"), CONSTRAINT "FK_8cdd0f83efe8f5df377eeab9b70" FOREIGN KEY ("trackId") REFERENCES "track" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_favorite_track"("Id", "trackId") SELECT "Id", "trackId" FROM "favorite_track"`);
        await queryRunner.query(`DROP TABLE "favorite_track"`);
        await queryRunner.query(`ALTER TABLE "temporary_favorite_track" RENAME TO "favorite_track"`);
        await queryRunner.query(`DROP INDEX "IDX_53e780b9e2955ef02466636cda"`);
        await queryRunner.query(`DROP INDEX "IDX_54dd1e92dd268df3dcc0cbb643"`);
        await queryRunner.query(`CREATE TABLE "temporary_playlist_tracks_track" ("playlistId" integer NOT NULL, "trackId" integer NOT NULL, CONSTRAINT "FK_53e780b9e2955ef02466636cda7" FOREIGN KEY ("playlistId") REFERENCES "playlist" ("Id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_54dd1e92dd268df3dcc0cbb643c" FOREIGN KEY ("trackId") REFERENCES "track" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("playlistId", "trackId"))`);
        await queryRunner.query(`INSERT INTO "temporary_playlist_tracks_track"("playlistId", "trackId") SELECT "playlistId", "trackId" FROM "playlist_tracks_track"`);
        await queryRunner.query(`DROP TABLE "playlist_tracks_track"`);
        await queryRunner.query(`ALTER TABLE "temporary_playlist_tracks_track" RENAME TO "playlist_tracks_track"`);
        await queryRunner.query(`CREATE INDEX "IDX_53e780b9e2955ef02466636cda" ON "playlist_tracks_track" ("playlistId") `);
        await queryRunner.query(`CREATE INDEX "IDX_54dd1e92dd268df3dcc0cbb643" ON "playlist_tracks_track" ("trackId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_54dd1e92dd268df3dcc0cbb643"`);
        await queryRunner.query(`DROP INDEX "IDX_53e780b9e2955ef02466636cda"`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks_track" RENAME TO "temporary_playlist_tracks_track"`);
        await queryRunner.query(`CREATE TABLE "playlist_tracks_track" ("playlistId" integer NOT NULL, "trackId" integer NOT NULL, PRIMARY KEY ("playlistId", "trackId"))`);
        await queryRunner.query(`INSERT INTO "playlist_tracks_track"("playlistId", "trackId") SELECT "playlistId", "trackId" FROM "temporary_playlist_tracks_track"`);
        await queryRunner.query(`DROP TABLE "temporary_playlist_tracks_track"`);
        await queryRunner.query(`CREATE INDEX "IDX_54dd1e92dd268df3dcc0cbb643" ON "playlist_tracks_track" ("trackId") `);
        await queryRunner.query(`CREATE INDEX "IDX_53e780b9e2955ef02466636cda" ON "playlist_tracks_track" ("playlistId") `);
        await queryRunner.query(`ALTER TABLE "favorite_track" RENAME TO "temporary_favorite_track"`);
        await queryRunner.query(`CREATE TABLE "favorite_track" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "trackId" integer, CONSTRAINT "REL_8cdd0f83efe8f5df377eeab9b7" UNIQUE ("trackId"))`);
        await queryRunner.query(`INSERT INTO "favorite_track"("Id", "trackId") SELECT "Id", "trackId" FROM "temporary_favorite_track"`);
        await queryRunner.query(`DROP TABLE "temporary_favorite_track"`);
        await queryRunner.query(`ALTER TABLE "favorite_artist" RENAME TO "temporary_favorite_artist"`);
        await queryRunner.query(`CREATE TABLE "favorite_artist" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "artistName" varchar, CONSTRAINT "REL_2c049131fb3640eba6bf7fcc00" UNIQUE ("artistName"))`);
        await queryRunner.query(`INSERT INTO "favorite_artist"("Id", "artistName") SELECT "Id", "artistName" FROM "temporary_favorite_artist"`);
        await queryRunner.query(`DROP TABLE "temporary_favorite_artist"`);
        await queryRunner.query(`ALTER TABLE "favorite_album" RENAME TO "temporary_favorite_album"`);
        await queryRunner.query(`CREATE TABLE "favorite_album" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "albumId" integer, CONSTRAINT "REL_25b9b6014e56d858b32863836c" UNIQUE ("albumId"))`);
        await queryRunner.query(`INSERT INTO "favorite_album"("Id", "albumId") SELECT "Id", "albumId" FROM "temporary_favorite_album"`);
        await queryRunner.query(`DROP TABLE "temporary_favorite_album"`);
        await queryRunner.query(`ALTER TABLE "album" RENAME TO "temporary_album"`);
        await queryRunner.query(`CREATE TABLE "album" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Name" varchar NOT NULL, "artistName" varchar)`);
        await queryRunner.query(`INSERT INTO "album"("Id", "Name", "artistName") SELECT "Id", "Name", "artistName" FROM "temporary_album"`);
        await queryRunner.query(`DROP TABLE "temporary_album"`);
        await queryRunner.query(`ALTER TABLE "track" RENAME TO "temporary_track"`);
        await queryRunner.query(`CREATE TABLE "track" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Name" varchar NOT NULL, "ISRC" varchar, "artistName" varchar, "albumId" integer)`);
        await queryRunner.query(`INSERT INTO "track"("Id", "Name", "ISRC", "artistName", "albumId") SELECT "Id", "Name", "ISRC", "artistName", "albumId" FROM "temporary_track"`);
        await queryRunner.query(`DROP TABLE "temporary_track"`);
        await queryRunner.query(`DROP INDEX "IDX_54dd1e92dd268df3dcc0cbb643"`);
        await queryRunner.query(`DROP INDEX "IDX_53e780b9e2955ef02466636cda"`);
        await queryRunner.query(`DROP TABLE "playlist_tracks_track"`);
        await queryRunner.query(`DROP TABLE "favorite_track"`);
        await queryRunner.query(`DROP TABLE "favorite_artist"`);
        await queryRunner.query(`DROP TABLE "favorite_album"`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`DROP TABLE "artist"`);
        await queryRunner.query(`DROP TABLE "track"`);
        await queryRunner.query(`DROP TABLE "playlist"`);
    }

}
