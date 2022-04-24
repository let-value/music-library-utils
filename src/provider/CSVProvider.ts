import { format, FormatterOptionsArgs, parse, ParserOptionsArgs } from "fast-csv";
import { Readable, Writable } from "stream";
import { Service } from "typedi";
import { DataBase, DataSource } from "../db";
import { Album, Artist, Playlist, Track } from "../db/entity";
import { ExportOptions, ExportRecord, Provider, TransferResult } from "./Provider";

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

export type CSVRow = Partial<Record<keyof HeadersConfig, string>>;

@Service({
    transient: true,
})
export class CSVProvider extends Provider {
    headers?: HeadersConfig = undefined;
    importResult?: TransferResult = undefined;

    constructor(@DataBase() dataSource: DataSource) {
        super(dataSource);
    }

    private convertRowToRecord(row: string[]) {
        return Object.fromEntries(row.map((value, index) => [`column${index + 1}`, value]));
    }

    private convertRecordToRow({ track, album, playlist }: ExportRecord): CSVRow {
        return {
            track: track.Name,
            artist: track.Artist.Name,
            album: album?.Name ?? undefined,
            playlist: playlist?.Name ?? undefined,
        };
    }

    async getCSVPreview(stream: Readable, options: ParserOptionsArgs, abort: AbortSignal) {
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

    getRecordPropertyName(
        record: Record<string, string>,
        property: keyof HeadersConfig | string,
        number?: number,
        required = false
    ) {
        const keys = Object.keys(record);
        let result = "";

        if (this.headers && property in this.headers) {
            const searchKey = this.headers[property as keyof HeadersConfig].toLowerCase();
            result = keys.find((key) => key.toLowerCase().includes(searchKey)) ?? "";
        }

        if (!result || !this.headers || !(property in this.headers)) {
            const searchKey = property.toLowerCase();
            result = keys.find((key) => key.toLowerCase().includes(searchKey)) ?? "";
        }

        if (!result && number != undefined) {
            result = keys[number];
        }

        if (required && !result) {
            throw new Error(`Could not find ${property} column in ${keys}`);
        }

        return result;
    }

    async processTrack(order: number, record: Record<string, string>) {
        const trackKey = this.getRecordPropertyName(record, "track", 0, true);
        const artistKey = this.getRecordPropertyName(record, "artist", 1, true);
        const albumKey = this.getRecordPropertyName(record, "album", 2);
        const playlistKey = this.getRecordPropertyName(record, "playlist", 3);
        const isrcKey = this.getRecordPropertyName(record, "isrc", undefined, true);

        const trackName = record[trackKey];
        const artistName = record[artistKey];
        const albumName = record[albumKey];
        const playlistName = record[playlistKey];
        const isrc = record[isrcKey];

        const track = await this.importTrack(trackName, artistName, albumName, playlistName, order);

        if (isrc) {
            track.ISRC = isrc ?? track.ISRC;
            await this.manager?.getRepository(Track).save(track);
        }
    }

    async importCSV(stream: Readable, options: ParserOptionsArgs, properties?: HeadersConfig, abort?: AbortSignal) {
        this.headers = properties ?? options.headers ? DEFAULT_HEADERS : undefined;

        await this.beginImport(async () => {
            let order = 0;
            const trackTasks: Promise<unknown>[] = [];

            const callback = options.headers
                ? (row: Record<string, string>) => trackTasks.push(this.processTrack(order++, row))
                : (row: string[]) => {
                      const record = this.convertRowToRecord(row);
                      trackTasks.push(this.processTrack(order++, record));
                  };

            const pipeline = new Readable({ signal: abort }).wrap(stream).pipe(parse(options)).on("data", callback);

            await new Promise((resolve, reject) => {
                pipeline.on("end", resolve);
                pipeline.on("error", reject);
            });

            await Promise.all(trackTasks);

            this.importResult = this.getResult();
        });

        return this.importResult;
    }

    async exportCSV(
        requestStream: Generator<Writable, void, unknown>,
        props: ExportOptions,
        options: FormatterOptionsArgs<CSVRow, CSVRow>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _abort?: AbortSignal
    ) {
        let counter = 0;
        const tracks = new Set<Track>();
        const artist = new Set<Artist>();
        const playlists = new Set<Playlist>();
        const albums = new Set<Album>();

        const stream = requestStream.next().value;

        if (!stream) {
            throw new Error("Supply at least one stream");
        }

        let pipeline = format(options);
        //.pipe(new PassThrough({ signal: abort }))
        pipeline.pipe(stream);

        const generator = await this.getExportCollection(props);
        const collection = generator();

        for (const item of collection) {
            tracks.add(item.track);
            if (item.artist) {
                artist.add(item.artist);
            }
            if (item.album) {
                albums.add(item.album);
            }
            if (item.playlist) {
                playlists.add(item.playlist);
            }

            const row = this.convertRecordToRow(item);
            pipeline.write(row);

            counter++;

            if (props.limit && counter == props.limit) {
                counter = 0;
                const stream = requestStream.next().value;
                if (!stream) {
                    continue;
                }
                pipeline.end();
                pipeline = format(options);
                //.pipe(new PassThrough({ signal: abort }))
                pipeline.pipe(stream);
            }
        }

        pipeline.end();

        return {
            playlists: Array.from(playlists),
            albums: Array.from(albums),
            artists: Array.from(artist),
            tracks: Array.from(tracks),
        };
    }
}
