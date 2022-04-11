import { ParserOptionsArgs } from "fast-csv";
import * as fs from "fs";
import { makeAutoObservable, runInAction } from "mobx";
import * as path from "path";
import { ReReadable } from "rereadable-stream";
import { Readable } from "stream";
import { Inject, Service } from "typedi";
import { Track } from "../db/entity";
import { CSVProvider, DEFAULT_HEADERS, ProviderQuestion } from "../provider";

@Service({
    transient: true,
})
export class CSVStore {
    headers: string[] = [];
    preview: Record<string, string>[] = [];
    currentTrack?: Track = undefined;

    setPreview(headers: CSVStore["headers"], preview: CSVStore["preview"]) {
        this.headers = headers;
        this.preview = preview;
    }

    askArtist = new ProviderQuestion("Select artist column name");
    askTrack = new ProviderQuestion("Select track name column name");
    askAlbum = new ProviderQuestion("Select album column name");
    askPlaylist = new ProviderQuestion("Select playlist column name");

    constructor(@Inject() private csvProvider: CSVProvider) {
        csvProvider.events.on("trackImport", this.handleCurrentTrack);
        csvProvider.events.on("end", this.handleEnd);
        makeAutoObservable(this);
    }

    handleCurrentTrack = (track: Track) => {
        runInAction(() => {
            this.currentTrack = track;
        });
    };
    handleEnd = () => {
        this.currentTrack = undefined;
    };

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
        this.setPreview(Object.values(DEFAULT_HEADERS), Array(1).fill(DEFAULT_HEADERS));
        return this.csvProvider.importFile(stream, options, undefined, abort);
    }
}
