import { EventEmitter } from "events";
import { memoize } from "lodash";
import TypedEmitter from "typed-emitter";
import { EntityManager } from "typeorm";
import { DataSource } from "../db";
import { Album, Artist, Playlist, Track } from "../db/entity";
import { PlaylistToTrack } from "../db/entity/PlaylistToTrack.entity";

export type ProviderEvents = {
    trackImport: (track: Track) => void;
    trackExport: (track: Track) => void;
    end: () => void;
};

export type ExportOptions = {
    limit?: number;
    playlist?: Playlist;
    album?: Album;
    artist?: Artist;
};

export type ExportRecord = {
    track: Track;
} & ExportOptions;

export type TransferResult = {
    tracks: Track[];
    artists: Artist[];
    albums: Album[];
    playlists: Playlist[];
};

export class Provider {
    manager?: EntityManager;
    events = new EventEmitter() as TypedEmitter<ProviderEvents>;
    updatedTracks = new Set<Track>();
    updatedArtist = new Set<Artist>();
    createdPlaylists = new Set<Playlist>();
    updatedAlbums = new Set<Album>();
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
        const artist = await manager.getRepository(Artist).save({ Name: name });
        this.updatedArtist.add(artist);
        return artist;
    });
    getAlbum = memoize(
        async (name: string, artist: Artist) => {
            const manager = this.getManager();
            const album = await manager
                .getRepository(Album)
                .save({ Name: name, artistName: artist.Name, Artist: artist });
            this.updatedAlbums.add(album);
            return album;
        },
        (name, artist) => `${name}-${artist.Name}`
    );
    getTrack = memoize(
        async (name: string, artist: Artist) => {
            const manager = this.getManager();
            const track = await manager
                .getRepository(Track)
                .save({ Name: name, artistName: artist.Name, Artist: artist });
            this.updatedTracks.add(track);
            return track;
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
    async getExportCollection(props: ExportOptions): Promise<() => Generator<ExportRecord, void, unknown>> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const ctx = this;
        if (props.playlist) {
            const playlist = await this.dataSource
                .getRepository(Playlist)
                .findOne({ where: { Id: props.playlist.Id } });
            if (!playlist) {
                throw new Error("Playlist not found");
            }

            const playlistTracks = await playlist.Tracks;
            return function* () {
                for (const playlistTrack of playlistTracks) {
                    ctx.events.emit("trackExport", playlistTrack.Track);
                    yield {
                        track: playlistTrack.Track,
                        album: playlistTrack.Album,
                        playlist: playlist,
                    };
                }
            };
        }

        if (props.album) {
            const album = await this.dataSource
                .getRepository(Album)
                .findOne({ where: { artistName: props.album.artistName, Name: props.album.Name } });
            if (!album) {
                throw new Error("Album not found");
            }

            const albumTracks = await album.Tracks;
            return function* () {
                for (const track of albumTracks) {
                    ctx.events.emit("trackExport", track);
                    yield {
                        track,
                        album,
                    };
                }
            };
        }

        if (props.artist) {
            throw new Error("Not implemented");
        }

        const tracks = await this.dataSource.getRepository(Track).find();
        return function* () {
            for (const track of tracks) {
                ctx.events.emit("trackExport", track);
                yield {
                    track,
                };
            }
        };
    }
    getResult(): TransferResult {
        return {
            playlists: Array.from(this.createdPlaylists),
            albums: Array.from(this.updatedAlbums),
            artists: Array.from(this.updatedArtist),
            tracks: Array.from(this.updatedTracks),
        };
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
        let album: Album | undefined = undefined;
        if (albumName) {
            album = await this.getAlbum(albumName, artist);
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

        await this.manager
            ?.getRepository(PlaylistToTrack)
            .insert({ Playlist: playlist, Track: track, Album: album, Order: order });

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
