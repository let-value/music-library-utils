import { parse, ParserOptionsArgs } from "fast-csv";
import * as fs from "fs";
import { makeAutoObservable } from "mobx";
import * as path from "path";
import { ReReadable } from "rereadable-stream";
import { Readable } from "stream";
import { Inject, Service } from "typedi";
import { DataBase, DataSource } from "../db";
import { Album, Artist, Track } from "../db/entity";
import { Provider } from "./Provider";
import { ProviderQuestion } from "./ProviderQuestion";

type HeadersConfig = {
    artist: string;
    track: string;
    album: string;
    playlist: string;
};

export const DEFAULT_HEADERS: HeadersConfig = {
    artist: "Artist",
    track: "Track",
    album: "Album",
    playlist: "Playlist",
};

@Service({
    transient: true,
})
export class CSVProvider extends Provider {
    constructor(@DataBase() dataSource: DataSource) {
        super(dataSource);
    }

    private convertRowToRecord(row: string[]) {
        return Object.fromEntries(row.map((value, index) => [`column${index + 1}`, value]));
    }

    async getFilePreview(stream: Readable, options: ParserOptionsArgs, abort: AbortSignal) {
        const headers = new Set<string>();
        const preview: Record<string, string>[] = [];

        const callback = options.headers
            ? (row: Record<string, string>) => {
                  Object.keys(row).forEach((key) => headers.add(key));
                  preview.push(row);
              }
            : (row: string[]) => {
                  const record = this.convertRowToRecord(row);
                  Object.keys(record).forEach((key) => headers.add(key));
                  preview.push(record);
              };

        const pipeline = new Readable({ signal: abort })
            .wrap(stream)
            .pipe(parse({ ...options, maxRows: 3 }))
            .on("data", callback);

        await new Promise((resolve, reject) => {
            pipeline.on("end", resolve);
            pipeline.on("error", reject);
        });

        return { headers: Array.from(headers), preview };
    }

    async importFile(stream: Readable, options: ParserOptionsArgs, properties?: HeadersConfig, abort?: AbortSignal) {
        const headers = properties ?? options.headers ? DEFAULT_HEADERS : undefined;

        const parseTrack = (record: Record<string, string>): Track => {
            const keys = Object.keys(record);

            const getKey = (key: keyof HeadersConfig, number: number, required = false) => {
                let result = "";
                if (headers) {
                    result = keys.find((x) => x.includes(headers[key])) ?? "";
                } else {
                    result = keys[number];
                }
                if (required && !result) {
                    throw new Error(`Could not find ${key} column in ${keys}`);
                }

                return result;
            };

            const trackKey = getKey("track", 0, true);
            const trackName = record[trackKey];
            const artistKey = getKey("artist", 1, true);
            const artistName = record[artistKey];
            const artist = new Artist({ Name: artistName });

            let album: Album | undefined = undefined;
            const albumKey = getKey("album", 2);
            const albumName = record[albumKey];
            if (albumKey && albumName) {
                album = new Album(albumName);
                album.Artist = artist;
            }

            //const playlistKey = getKey("playlist", 3);
            //const playlistName = record[playlistKey];
            //const playlist = this.getPlaylist(playlistName);

            return new Track({
                Name: trackName,
                Artist: artist,
                Albums: album ? [album] : undefined,
                //Playlist: Promise.resolve([playlist]),
            });
        };

        const callback = options.headers
            ? (row: Record<string, string>) => {
                  this.saveTrack(parseTrack(row));
              }
            : (row: string[]) => {
                  const record = this.convertRowToRecord(row);
                  this.saveTrack(parseTrack(record));
              };

        const pipeline = new Readable({ signal: abort }).wrap(stream).pipe(parse(options)).on("data", callback);

        await new Promise((resolve, reject) => {
            pipeline.on("end", resolve);
            pipeline.on("error", reject);
        });
    }
}

@Service({
    transient: true,
})
export class CSVStore {
    headers: string[] = [];
    preview: Record<string, string>[] = [];

    setPreview(headers: CSVStore["headers"], preview: CSVStore["preview"]) {
        this.headers = headers;
        this.preview = preview;
    }

    askArtist = new ProviderQuestion("Select artist column name");
    askTrack = new ProviderQuestion("Select track name column name");
    askAlbum = new ProviderQuestion("Select album column name");
    askPlaylist = new ProviderQuestion("Select playlist column name");

    constructor(@Inject() private csvProvider: CSVProvider) {
        makeAutoObservable(this);
    }

    async importFile(filePath: string, options: ParserOptionsArgs, abort: AbortSignal): Promise<void> {
        const location = path.resolve("./", filePath);
        const stream = fs.createReadStream(location);
        const reReadable = stream.pipe(new ReReadable());
        const { headers, preview } = await this.csvProvider.getFilePreview(reReadable.rewind(), options, abort);
        this.setPreview(headers, preview);

        const [artist, track, album, playlist] = await Promise.all([
            this.askArtist.raise(),
            this.askTrack.raise(),
            this.askAlbum.raise(),
            this.askPlaylist.raise(),
        ]);

        return this.csvProvider.importFile(stream, options, { artist, track, album, playlist }, abort);
    }

    importStream(stream: Readable, options: ParserOptionsArgs, abort: AbortSignal) {
        return this.csvProvider.importFile(stream, options, undefined, abort);
    }
}
