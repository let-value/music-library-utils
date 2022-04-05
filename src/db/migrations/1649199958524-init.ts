import { MigrationInterface, QueryRunner } from "typeorm";

export class init1649199958524 implements MigrationInterface {
    name = 'init1649199958524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "playlist" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "track" ("Name" varchar NOT NULL, "artistName" varchar NOT NULL, "ISRC" varchar, PRIMARY KEY ("Name", "artistName"))`);
        await queryRunner.query(`CREATE TABLE "artist" ("Name" varchar PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "album" ("Name" varchar NOT NULL, "artistName" varchar NOT NULL, PRIMARY KEY ("Name", "artistName"))`);
        await queryRunner.query(`CREATE TABLE "favorite_artist" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "artistName" varchar, CONSTRAINT "REL_2c049131fb3640eba6bf7fcc00" UNIQUE ("artistName"))`);
        await queryRunner.query(`CREATE TABLE "favorite_album" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "albumName" varchar, "albumArtistName" varchar, CONSTRAINT "REL_dd9d23afedcbf392da0180cdc7" UNIQUE ("albumName", "albumArtistName"))`);
        await queryRunner.query(`CREATE TABLE "favorite_track" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "trackName" varchar, "trackArtistName" varchar, CONSTRAINT "REL_d92b2ef036f5bdbb7fe3d4fbfe" UNIQUE ("trackName", "trackArtistName"))`);
        await queryRunner.query(`CREATE TABLE "playlist_tracks_track" ("playlistId" integer NOT NULL, "trackName" varchar NOT NULL, "trackArtistName" varchar NOT NULL, PRIMARY KEY ("playlistId", "trackName", "trackArtistName"))`);
        await queryRunner.query(`CREATE INDEX "IDX_53e780b9e2955ef02466636cda" ON "playlist_tracks_track" ("playlistId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c47beb0480e2635de40b557f86" ON "playlist_tracks_track" ("trackName", "trackArtistName") `);
        await queryRunner.query(`CREATE TABLE "track_albums_album" ("trackName" varchar NOT NULL, "trackArtistName" varchar NOT NULL, "albumName" varchar NOT NULL, "albumArtistName" varchar NOT NULL, PRIMARY KEY ("trackName", "trackArtistName", "albumName", "albumArtistName"))`);
        await queryRunner.query(`CREATE INDEX "IDX_efe9aa0554c7e31c3182468d7b" ON "track_albums_album" ("trackName", "trackArtistName") `);
        await queryRunner.query(`CREATE INDEX "IDX_20c05a4da4ee1321cd8a9e9b6e" ON "track_albums_album" ("albumName", "albumArtistName") `);
        await queryRunner.query(`CREATE TABLE "temporary_track" ("Name" varchar NOT NULL, "artistName" varchar NOT NULL, "ISRC" varchar, CONSTRAINT "FK_70f1a05b138df8f4dc908a15eb5" FOREIGN KEY ("artistName") REFERENCES "artist" ("Name") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("Name", "artistName"))`);
        await queryRunner.query(`INSERT INTO "temporary_track"("Name", "artistName", "ISRC") SELECT "Name", "artistName", "ISRC" FROM "track"`);
        await queryRunner.query(`DROP TABLE "track"`);
        await queryRunner.query(`ALTER TABLE "temporary_track" RENAME TO "track"`);
        await queryRunner.query(`CREATE TABLE "temporary_album" ("Name" varchar NOT NULL, "artistName" varchar NOT NULL, CONSTRAINT "FK_e2bcbb6ff3ffdbbb95668233512" FOREIGN KEY ("artistName") REFERENCES "artist" ("Name") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("Name", "artistName"))`);
        await queryRunner.query(`INSERT INTO "temporary_album"("Name", "artistName") SELECT "Name", "artistName" FROM "album"`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`ALTER TABLE "temporary_album" RENAME TO "album"`);
        await queryRunner.query(`CREATE TABLE "temporary_favorite_artist" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "artistName" varchar, CONSTRAINT "REL_2c049131fb3640eba6bf7fcc00" UNIQUE ("artistName"), CONSTRAINT "FK_2c049131fb3640eba6bf7fcc007" FOREIGN KEY ("artistName") REFERENCES "artist" ("Name") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_favorite_artist"("Id", "artistName") SELECT "Id", "artistName" FROM "favorite_artist"`);
        await queryRunner.query(`DROP TABLE "favorite_artist"`);
        await queryRunner.query(`ALTER TABLE "temporary_favorite_artist" RENAME TO "favorite_artist"`);
        await queryRunner.query(`CREATE TABLE "temporary_favorite_album" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "albumName" varchar, "albumArtistName" varchar, CONSTRAINT "REL_dd9d23afedcbf392da0180cdc7" UNIQUE ("albumName", "albumArtistName"), CONSTRAINT "FK_dd9d23afedcbf392da0180cdc71" FOREIGN KEY ("albumName", "albumArtistName") REFERENCES "album" ("Name", "artistName") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_favorite_album"("Id", "albumName", "albumArtistName") SELECT "Id", "albumName", "albumArtistName" FROM "favorite_album"`);
        await queryRunner.query(`DROP TABLE "favorite_album"`);
        await queryRunner.query(`ALTER TABLE "temporary_favorite_album" RENAME TO "favorite_album"`);
        await queryRunner.query(`CREATE TABLE "temporary_favorite_track" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "trackName" varchar, "trackArtistName" varchar, CONSTRAINT "REL_d92b2ef036f5bdbb7fe3d4fbfe" UNIQUE ("trackName", "trackArtistName"), CONSTRAINT "FK_d92b2ef036f5bdbb7fe3d4fbfe8" FOREIGN KEY ("trackName", "trackArtistName") REFERENCES "track" ("Name", "artistName") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_favorite_track"("Id", "trackName", "trackArtistName") SELECT "Id", "trackName", "trackArtistName" FROM "favorite_track"`);
        await queryRunner.query(`DROP TABLE "favorite_track"`);
        await queryRunner.query(`ALTER TABLE "temporary_favorite_track" RENAME TO "favorite_track"`);
        await queryRunner.query(`DROP INDEX "IDX_53e780b9e2955ef02466636cda"`);
        await queryRunner.query(`DROP INDEX "IDX_c47beb0480e2635de40b557f86"`);
        await queryRunner.query(`CREATE TABLE "temporary_playlist_tracks_track" ("playlistId" integer NOT NULL, "trackName" varchar NOT NULL, "trackArtistName" varchar NOT NULL, CONSTRAINT "FK_53e780b9e2955ef02466636cda7" FOREIGN KEY ("playlistId") REFERENCES "playlist" ("Id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_c47beb0480e2635de40b557f866" FOREIGN KEY ("trackName", "trackArtistName") REFERENCES "track" ("Name", "artistName") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("playlistId", "trackName", "trackArtistName"))`);
        await queryRunner.query(`INSERT INTO "temporary_playlist_tracks_track"("playlistId", "trackName", "trackArtistName") SELECT "playlistId", "trackName", "trackArtistName" FROM "playlist_tracks_track"`);
        await queryRunner.query(`DROP TABLE "playlist_tracks_track"`);
        await queryRunner.query(`ALTER TABLE "temporary_playlist_tracks_track" RENAME TO "playlist_tracks_track"`);
        await queryRunner.query(`CREATE INDEX "IDX_53e780b9e2955ef02466636cda" ON "playlist_tracks_track" ("playlistId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c47beb0480e2635de40b557f86" ON "playlist_tracks_track" ("trackName", "trackArtistName") `);
        await queryRunner.query(`DROP INDEX "IDX_efe9aa0554c7e31c3182468d7b"`);
        await queryRunner.query(`DROP INDEX "IDX_20c05a4da4ee1321cd8a9e9b6e"`);
        await queryRunner.query(`CREATE TABLE "temporary_track_albums_album" ("trackName" varchar NOT NULL, "trackArtistName" varchar NOT NULL, "albumName" varchar NOT NULL, "albumArtistName" varchar NOT NULL, CONSTRAINT "FK_efe9aa0554c7e31c3182468d7bf" FOREIGN KEY ("trackName", "trackArtistName") REFERENCES "track" ("Name", "artistName") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_20c05a4da4ee1321cd8a9e9b6e7" FOREIGN KEY ("albumName", "albumArtistName") REFERENCES "album" ("Name", "artistName") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("trackName", "trackArtistName", "albumName", "albumArtistName"))`);
        await queryRunner.query(`INSERT INTO "temporary_track_albums_album"("trackName", "trackArtistName", "albumName", "albumArtistName") SELECT "trackName", "trackArtistName", "albumName", "albumArtistName" FROM "track_albums_album"`);
        await queryRunner.query(`DROP TABLE "track_albums_album"`);
        await queryRunner.query(`ALTER TABLE "temporary_track_albums_album" RENAME TO "track_albums_album"`);
        await queryRunner.query(`CREATE INDEX "IDX_efe9aa0554c7e31c3182468d7b" ON "track_albums_album" ("trackName", "trackArtistName") `);
        await queryRunner.query(`CREATE INDEX "IDX_20c05a4da4ee1321cd8a9e9b6e" ON "track_albums_album" ("albumName", "albumArtistName") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_20c05a4da4ee1321cd8a9e9b6e"`);
        await queryRunner.query(`DROP INDEX "IDX_efe9aa0554c7e31c3182468d7b"`);
        await queryRunner.query(`ALTER TABLE "track_albums_album" RENAME TO "temporary_track_albums_album"`);
        await queryRunner.query(`CREATE TABLE "track_albums_album" ("trackName" varchar NOT NULL, "trackArtistName" varchar NOT NULL, "albumName" varchar NOT NULL, "albumArtistName" varchar NOT NULL, PRIMARY KEY ("trackName", "trackArtistName", "albumName", "albumArtistName"))`);
        await queryRunner.query(`INSERT INTO "track_albums_album"("trackName", "trackArtistName", "albumName", "albumArtistName") SELECT "trackName", "trackArtistName", "albumName", "albumArtistName" FROM "temporary_track_albums_album"`);
        await queryRunner.query(`DROP TABLE "temporary_track_albums_album"`);
        await queryRunner.query(`CREATE INDEX "IDX_20c05a4da4ee1321cd8a9e9b6e" ON "track_albums_album" ("albumName", "albumArtistName") `);
        await queryRunner.query(`CREATE INDEX "IDX_efe9aa0554c7e31c3182468d7b" ON "track_albums_album" ("trackName", "trackArtistName") `);
        await queryRunner.query(`DROP INDEX "IDX_c47beb0480e2635de40b557f86"`);
        await queryRunner.query(`DROP INDEX "IDX_53e780b9e2955ef02466636cda"`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks_track" RENAME TO "temporary_playlist_tracks_track"`);
        await queryRunner.query(`CREATE TABLE "playlist_tracks_track" ("playlistId" integer NOT NULL, "trackName" varchar NOT NULL, "trackArtistName" varchar NOT NULL, PRIMARY KEY ("playlistId", "trackName", "trackArtistName"))`);
        await queryRunner.query(`INSERT INTO "playlist_tracks_track"("playlistId", "trackName", "trackArtistName") SELECT "playlistId", "trackName", "trackArtistName" FROM "temporary_playlist_tracks_track"`);
        await queryRunner.query(`DROP TABLE "temporary_playlist_tracks_track"`);
        await queryRunner.query(`CREATE INDEX "IDX_c47beb0480e2635de40b557f86" ON "playlist_tracks_track" ("trackName", "trackArtistName") `);
        await queryRunner.query(`CREATE INDEX "IDX_53e780b9e2955ef02466636cda" ON "playlist_tracks_track" ("playlistId") `);
        await queryRunner.query(`ALTER TABLE "favorite_track" RENAME TO "temporary_favorite_track"`);
        await queryRunner.query(`CREATE TABLE "favorite_track" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "trackName" varchar, "trackArtistName" varchar, CONSTRAINT "REL_d92b2ef036f5bdbb7fe3d4fbfe" UNIQUE ("trackName", "trackArtistName"))`);
        await queryRunner.query(`INSERT INTO "favorite_track"("Id", "trackName", "trackArtistName") SELECT "Id", "trackName", "trackArtistName" FROM "temporary_favorite_track"`);
        await queryRunner.query(`DROP TABLE "temporary_favorite_track"`);
        await queryRunner.query(`ALTER TABLE "favorite_album" RENAME TO "temporary_favorite_album"`);
        await queryRunner.query(`CREATE TABLE "favorite_album" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "albumName" varchar, "albumArtistName" varchar, CONSTRAINT "REL_dd9d23afedcbf392da0180cdc7" UNIQUE ("albumName", "albumArtistName"))`);
        await queryRunner.query(`INSERT INTO "favorite_album"("Id", "albumName", "albumArtistName") SELECT "Id", "albumName", "albumArtistName" FROM "temporary_favorite_album"`);
        await queryRunner.query(`DROP TABLE "temporary_favorite_album"`);
        await queryRunner.query(`ALTER TABLE "favorite_artist" RENAME TO "temporary_favorite_artist"`);
        await queryRunner.query(`CREATE TABLE "favorite_artist" ("Id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "artistName" varchar, CONSTRAINT "REL_2c049131fb3640eba6bf7fcc00" UNIQUE ("artistName"))`);
        await queryRunner.query(`INSERT INTO "favorite_artist"("Id", "artistName") SELECT "Id", "artistName" FROM "temporary_favorite_artist"`);
        await queryRunner.query(`DROP TABLE "temporary_favorite_artist"`);
        await queryRunner.query(`ALTER TABLE "album" RENAME TO "temporary_album"`);
        await queryRunner.query(`CREATE TABLE "album" ("Name" varchar NOT NULL, "artistName" varchar NOT NULL, PRIMARY KEY ("Name", "artistName"))`);
        await queryRunner.query(`INSERT INTO "album"("Name", "artistName") SELECT "Name", "artistName" FROM "temporary_album"`);
        await queryRunner.query(`DROP TABLE "temporary_album"`);
        await queryRunner.query(`ALTER TABLE "track" RENAME TO "temporary_track"`);
        await queryRunner.query(`CREATE TABLE "track" ("Name" varchar NOT NULL, "artistName" varchar NOT NULL, "ISRC" varchar, PRIMARY KEY ("Name", "artistName"))`);
        await queryRunner.query(`INSERT INTO "track"("Name", "artistName", "ISRC") SELECT "Name", "artistName", "ISRC" FROM "temporary_track"`);
        await queryRunner.query(`DROP TABLE "temporary_track"`);
        await queryRunner.query(`DROP INDEX "IDX_20c05a4da4ee1321cd8a9e9b6e"`);
        await queryRunner.query(`DROP INDEX "IDX_efe9aa0554c7e31c3182468d7b"`);
        await queryRunner.query(`DROP TABLE "track_albums_album"`);
        await queryRunner.query(`DROP INDEX "IDX_c47beb0480e2635de40b557f86"`);
        await queryRunner.query(`DROP INDEX "IDX_53e780b9e2955ef02466636cda"`);
        await queryRunner.query(`DROP TABLE "playlist_tracks_track"`);
        await queryRunner.query(`DROP TABLE "favorite_track"`);
        await queryRunner.query(`DROP TABLE "favorite_album"`);
        await queryRunner.query(`DROP TABLE "favorite_artist"`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`DROP TABLE "artist"`);
        await queryRunner.query(`DROP TABLE "track"`);
        await queryRunner.query(`DROP TABLE "playlist"`);
    }

}
