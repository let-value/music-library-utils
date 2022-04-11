import { EventEmitter } from "events";
import { memoize } from "lodash";
import TypedEmitter from "typed-emitter";
import { EntityManager } from "typeorm";
import { DataSource } from "../db";
import { Album, Artist, Playlist, Track } from "../db/entity";
import { PlaylistToTrack } from "../db/entity/PlaylistToTrack.entity";

export type ProviderEvents = {
    trackImport: (track: Track) => void;
    end: () => void;
};

export class Provider {
    manager?: EntityManager;
    events = new EventEmitter() as TypedEmitter<ProviderEvents>;
    private createdPlaylists = new Set<Playlist>();
    private updatedAlbums = new Set<Album>();
    constructor(public dataSource: DataSource) {}
    getManager() {
        if (!this.manager) {
            throw new Error("Wrap function calls into beginImport()");
        }

        return this.manager;
    }
    getPlaylist = memoize(async (name: string | undefined = undefined) => {
        const manager = this.getManager();
        const playlistName = name ?? `Import ${new Date().toISOString()}`;
        const playlist = await manager.getRepository(Playlist).save(new Playlist(playlistName));
        this.createdPlaylists.add(playlist);
        return playlist;
    });
    getArtist = memoize(async (name: string) => {
        const manager = this.getManager();
        return await manager.getRepository(Artist).save({ Name: name });
    });
    getAlbum = memoize(
        async (name: string, artist: Artist) => {
            const manager = this.getManager();
            return await manager.getRepository(Album).save({ Name: name, artistName: artist.Name, Artist: artist });
        },
        (name, artist) => `${name}-${artist.Name}`
    );
    getTrack = memoize(
        async (name: string, artist: Artist) => {
            const manager = this.getManager();
            return await manager.getRepository(Track).save({ Name: name, artistName: artist.Name, Artist: artist });
        },
        (name, artist) => `${name}-${artist.Name}`
    );
    beginImport(actions: () => Promise<unknown>, transaction = true) {
        const pipeline = async (manager: EntityManager) => {
            this.manager = manager;
            await actions();
            await this.saveCreatedPlaylists();
            this.finishImport();
        };
        return transaction ? this.dataSource.transaction(pipeline) : pipeline(this.dataSource.manager);
    }
    private finishImport() {
        this.getPlaylist.cache.clear?.();
        this.getArtist.cache.clear?.();
        this.getAlbum.cache.clear?.();
        this.createdPlaylists.clear();
        this.updatedAlbums.clear();
        this.manager = undefined;
        this.events.emit("end");
    }
    async importTrack(
        trackName: string,
        artistName: string,
        albumName?: string,
        playlistName?: string,
        playlistPosition?: number
    ) {
        const artist = await this.getArtist(artistName);
        const track = await this.getTrack(trackName, artist);
        if (albumName) {
            const album = await this.getAlbum(albumName, artist);
            if (!album.Tracks) {
                album.Tracks = [];
            }
            if (!album.Tracks.some((t) => t.Name === track.Name)) {
                album.Tracks.push(track);
                this.updatedAlbums.add(album);
            }
        }

        this.events.emit("trackImport", track);

        const playlist = await this.getPlaylist(playlistName);
        const playlistTracks = await playlist.Tracks;
        const order = playlistPosition ?? playlistTracks.length;

        await this.manager?.getRepository(PlaylistToTrack).insert({ Playlist: playlist, Track: track, Order: order });

        return track;
    }
    private async saveCreatedPlaylists() {
        for await (const album of this.updatedAlbums) {
            await this.manager?.getRepository(Album).save(album);
        }

        // for await (const playlist of this.createdPlaylists) {
        //     await this.manager?.getRepository(Playlist).save(playlist);
        // }
    }
}
