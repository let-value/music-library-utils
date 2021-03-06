import { FormatterOptionsArgs, ParserOptionsArgs } from "fast-csv";
import * as fs from "fs";
import { makeAutoObservable, runInAction } from "mobx";
import * as path from "path";
import { ReReadable } from "rereadable-stream";
import { Readable, Writable } from "stream";
import { Inject, Service } from "typedi";
import { Track } from "../db/entity";
import { CSVProvider, CSVRow, DEFAULT_HEADERS, ExportOptions, ProviderQuestion, TransferResult } from "../provider";

@Service({
    transient: true,
})
export class CSVStore {
    headers: string[] = [];
    preview: Record<string, string>[] = [];
    currentTrack?: Track = undefined;
    importResult?: TransferResult = undefined;
    exportResult?: TransferResult = undefined;

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
        csvProvider.events.on("trackExport", this.handleCurrentTrack);
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
        const { headers, preview } = await this.csvProvider.getCSVPreview(reReadable.rewind(), options, abort);
        this.setPreview(headers, preview);

        const [artist, track, album, playlist] = await Promise.all([
            this.askArtist.raise(),
            this.askTrack.raise(),
            this.askAlbum.raise(),
            this.askPlaylist.raise(),
        ]);

        const result = await this.csvProvider.importCSV(
            reReadable.rewind(),
            options,
            { artist, track, album, playlist },
            abort
        );

        runInAction(() => {
            this.importResult = result;
        });
    }

    async importStream(stream: Readable, options: ParserOptionsArgs, abort: AbortSignal) {
        this.setPreview(Object.values(DEFAULT_HEADERS), Array(1).fill(DEFAULT_HEADERS));
        const result = await this.csvProvider.importCSV(stream, options, undefined, abort);
        runInAction(() => {
            this.importResult = result;
        });
    }

    async exportFile(
        filePath: string,
        props: ExportOptions,
        options: FormatterOptionsArgs<CSVRow, CSVRow>,
        abort: AbortSignal
    ) {
        const location = path.resolve("./", filePath);

        function* streamFabric() {
            let index = 1;
            while (true) {
                let currentPath = location;
                let extension = path.extname(currentPath);
                let fileName = path.basename(currentPath).replace(extension, "");

                if (!extension) {
                    extension = ".csv";
                }

                if (index > 1) {
                    fileName = `${fileName}_${index}`;
                }

                currentPath = path.join(path.dirname(currentPath), `${fileName}${extension}`);
                yield fs.createWriteStream(currentPath);
                index++;
            }
        }

        const result = await this.csvProvider.exportCSV(streamFabric(), props, options, abort);

        runInAction(() => {
            this.exportResult = result;
        });
    }

    async exportStream(
        stream: Writable,
        props: ExportOptions,
        options: FormatterOptionsArgs<CSVRow, CSVRow>,
        abort: AbortSignal
    ) {
        function* fakeIterator() {
            yield stream;
        }

        const result = await this.csvProvider.exportCSV(fakeIterator(), props, options, abort);

        runInAction(() => {
            this.exportResult = result;
        });
    }
}
