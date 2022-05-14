import SpotifyWebApi from "spotify-web-api-node";
import { Album, Artist, FavoriteTrack, Playlist, PlaylistToTrack, Track } from "../../db/entity";
import { ILibrary, LibraryFeature } from "../Library";

interface PaginationOptions {
    offset?: number;
    limit?: number;
}

interface PagingObject<TItem> {
    items: TItem[];
    limit: number;
    offset: number;
    total: number;
}

type ApiMethods = {
    [K in keyof SpotifyWebApi]: ReturnType<SpotifyWebApi[K]> extends Promise<Awaited<ReturnType<SpotifyWebApi[K]>>>
        ? K
        : never;
}[keyof SpotifyWebApi];

export class SpotifyLibrary implements ILibrary {
    features = [LibraryFeature.favorite_tracks, LibraryFeature.playlists];
    constructor(public api: SpotifyWebApi) {}

    async getPlaylists() {
        const response = await this.loadEverything("getUserPlaylists", (response) => response.body);
        return response.items.map((playlist, index) => this.convertPlaylist(playlist, index));
    }

    async getFavoriteTracks(): Promise<FavoriteTrack[]> {
        const response = await this.loadEverything("getMySavedTracks", (response) => response.body);
        return response.items
            .map((track, index) => this.convertSavedTrack(track, index))
            .filter((x): x is FavoriteTrack => Boolean(x));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async loadEverything<
        TItem,
        TMethod extends ApiMethods,
        TRequest extends SpotifyWebApi[TMethod],
        TResponse extends ReturnType<TRequest>,
        TOptions extends Parameters<SpotifyWebApi[TMethod]>
    >(method: TMethod, cursor: (response: Awaited<TResponse>) => PagingObject<TItem>, ...args: TOptions) {
        const loader = this.api[method].bind(this.api) as (...args: TOptions) => TResponse;
        const paginationPosition = loader.length - 1;
        const head = args?.slice(0, paginationPosition - 1) as Head<TOptions>;
        const pagination = (args?.[paginationPosition] as Last<TOptions>) ?? { limit: 50 };
        const parameters = [...head, pagination] as unknown as TOptions;
        const response = (await loader(...parameters)) as Awaited<TResponse>;
        let result = cursor(response);
        while (result.items.length < result.total) {
            const newPagination = (pagination ?? {}) as PaginationOptions;
            newPagination.limit = result.limit;
            newPagination.offset = result.items.length;
            const parameters = [...head, newPagination] as unknown as TOptions;
            const response = (await loader(...parameters)) as Awaited<TResponse>;
            const current = cursor(response);
            result = {
                ...result,
                ...current,
                items: [...result.items, ...current.items],
            };
        }
        return result;
    }

    private convertSavedTrack(spotifySavedTrack: SpotifyApi.SavedTrackObject, index: number) {
        const track = this.convertFullTrack(spotifySavedTrack.track);
        if (!track) {
            return undefined;
        }
        const result = new FavoriteTrack();
        result.Id = index;
        result.Track = track;
        result.AddedAt = new Date(spotifySavedTrack.added_at);

        return result;
    }

    private convertPlaylist(spotifyPlaylist: SpotifyApi.PlaylistObjectSimplified, index: number) {
        const playlist = new Playlist(spotifyPlaylist.name);
        playlist.Id = index;
        // eslint-disable-next-line no-async-promise-executor
        playlist.Tracks = this.playlistTracksLoader(spotifyPlaylist, playlist);
        return playlist;
    }

    private convertPlaylistTrack(spotifyPlaylistTrack: SpotifyApi.PlaylistTrackObject, playlist: Playlist) {
        const track = this.convertFullTrack(spotifyPlaylistTrack.track);
        const result = new PlaylistToTrack({
            Playlist: playlist,
            Track: track,
            AddedAt: new Date(spotifyPlaylistTrack.added_at),
        });

        return result;
    }

    convertAlbum(spotifyAlbum: SpotifyApi.AlbumObjectSimplified) {
        const artist = this.convertArtist(spotifyAlbum.artists[0]);

        const album = new Album({
            Artist: artist,
            Name: spotifyAlbum.name,
        });
        return album;
    }

    convertArtist(spotifyArtist: SpotifyApi.ArtistObjectSimplified | undefined) {
        if (!spotifyArtist) {
            return undefined;
        }

        const artist = new Artist(spotifyArtist?.name);
        return artist;
    }

    convertFullTrack(spotifyTrack: SpotifyApi.TrackObjectFull | null): Track | undefined {
        if (!spotifyTrack) {
            return undefined;
        }

        const artist = this.convertArtist(spotifyTrack.artists[0]);
        const album = this.convertAlbum(spotifyTrack.album);
        const track = new Track({
            Albums: Promise.resolve([album]),
            Artist: artist,
            Name: spotifyTrack?.name,
        });

        return track;
    }

    private playlistTracksLoader = (spotifyPlaylist: SpotifyApi.PlaylistObjectSimplified, playlist: Playlist) =>
        // eslint-disable-next-line no-async-promise-executor
        new Promise<PlaylistToTrack[]>(async (resolve, reject) => {
            try {
                const response = await this.loadEverything(
                    "getPlaylistTracks",
                    (response) => response.body,
                    spotifyPlaylist.id
                );
                const tracks = response.items.map((spotifyPlaylistTrack) =>
                    this.convertPlaylistTrack(spotifyPlaylistTrack, playlist)
                );
                resolve(tracks);
            } catch (error) {
                reject(error);
            }
        });
}
