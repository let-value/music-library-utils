import { parse, ParserOptionsArgs } from "fast-csv";
import * as fs from "fs";
import { makeAutoObservable } from "mobx";
import * as path from "path";
import { Service } from "typedi";
import { ProviderQuestion } from "./ProviderQuestion";

@Service({
    transient: true,
})
export class CSVProvider {
    headers: string[] = Array(10)
        .fill(0)
        .map((_, index) => `Column${index}`);
    preview: Record<string, string>[] = [];

    askArtist = new ProviderQuestion("Select artist column name");
    askTrack = new ProviderQuestion("Select track name column name");
    askAlbum = new ProviderQuestion("Select album column name");
    askPlaylist = new ProviderQuestion("Select playlist column name");

    constructor() {
        //@DataBase() private _dataSource: DataSource
        makeAutoObservable(this);
    }

    async import(filePath: string, options: ParserOptionsArgs, _abort: AbortSignal): Promise<void> {
        const location = path.resolve("./", filePath);
        const previewStream = fs
            .createReadStream(location)
            .pipe(parse({ ...options, maxRows: 3 }))

            .on("data", (row: Record<string, string> | string[]) => {
                if (Array.isArray(row)) {
                    const record = Object.fromEntries(row.map((value, index) => [this.headers[index], value]));
                    this.headers = Object.keys(record);
                    this.preview.push(record);
                } else {
                    this.headers = Object.keys(row);
                    this.preview.push(row);
                }
            });

        await new Promise((resolve, reject) => {
            previewStream.on("end", resolve);
            previewStream.on("error", reject);
        });

        const [_artist, _track, _album, _playlist] = await Promise.all([
            this.askArtist.raise(),
            this.askTrack.raise(),
            this.askAlbum.raise(),
            this.askPlaylist.raise(),
        ]);

        // const _stream = fs
        //     .createReadStream(path.resolve(__dirname, filePath))
        //     .pipe(parse({ headers: true }))
        //     .on("headers", (headers: string[]) => {
        //         this.headers = headers;
        //     })
        //     .on("data", (record: Record<string, string>) => {
        //         this.preview.push(record);
        //     });
    }
    public export(_path: string, _abort: AbortSignal): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
