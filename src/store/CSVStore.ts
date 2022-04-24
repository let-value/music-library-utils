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

        this.importResult = await this.csvProvider.importCSV(
            reReadable.rewind(),
            options,
            { artist, track, album, playlist },
            abort
        );
    }

    async importStream(stream: Readable, options: ParserOptionsArgs, abort: AbortSignal) {
        this.setPreview(Object.values(DEFAULT_HEADERS), Array(1).fill(DEFAULT_HEADERS));
        this.importResult = await this.csvProvider.importCSV(stream, options, undefined, abort);
    }

    async exportFile(
        filePath: string,
        props: ExportOptions,
        options: FormatterOptionsArgs<CSVRow, CSVRow>,
        abort: AbortSignal
    ) {
        const location = path.resolve("./", filePath);

        function* streamFabric() {
            let index = 0;
            while (true) {
                let currentPath = location;
                if (index > 0) {
                    const extension = path.extname(currentPath);
                    const fileName = path.basename(currentPath).replace(extension, "");
                    currentPath = path.join(path.dirname(currentPath), `${fileName}_${index}${extension}`);
                }
                yield fs.createWriteStream(currentPath);
                index++;
            }
        }

        this.exportResult = await this.csvProvider.exportCSV(streamFabric(), props, options, abort);
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
        this.exportResult = await this.csvProvider.exportCSV(fakeIterator(), props, options, abort);
    }
}
