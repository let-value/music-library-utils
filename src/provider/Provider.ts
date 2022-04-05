import { memoize } from "lodash";
import { DataSource } from "../db";
import { Playlist, Track } from "../db/entity";

export class Provider {
    constructor(public dataSource: DataSource) {}
    getPlaylist = memoize(async (name = undefined) => {
        const playlistName = name ?? `Import ${new Date().toISOString()}`;
        const playlist = new Playlist(playlistName);
        return await playlist.save();
    });
    saveTrack(track: Track) {
        return this.dataSource.getRepository(Track).save(track);
    }
}
