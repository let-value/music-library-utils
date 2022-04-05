import { memoize } from "lodash";
import { DataSource } from "../db";
import { Playlist, Track } from "../db/entity";

export class Provider {
    constructor(public dataSource: DataSource) {}
    getPlaylist = memoize((name = undefined) => {
        const playlistName = name ?? `Import ${new Date().toISOString()}`;
        return new Playlist(playlistName);
    });
    saveTrack(track: Track) {
        return this.dataSource.getRepository(Track).save(track);
    }
}
