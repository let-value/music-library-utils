import SpotifyWebApi from "spotify-web-api-node";
import { Album, Artist, Playlist, PlaylistToTrack, Track } from "../../db/entity";
import { ILibrary, LibraryFeature } from "../Library";

export class SpotifyLibrary implements ILibrary {
    features = [LibraryFeature.playlists];
    constructor(public api: SpotifyWebApi) {}
    async getPlaylists(): Promise<Playlist[]> {
        const response = await this.api.getUserPlaylists();
        return response.body.items.map((playlist, index) => this.convertPlaylist(playlist, index));
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
                const response = await this.api.getPlaylistTracks(spotifyPlaylist.id);
                const tracks = response.body.items.map((spotifyPlaylistTrack) =>
                    this.convertPlaylistTrack(spotifyPlaylistTrack, playlist)
                );
                resolve(tracks);
            } catch (error) {
                reject(error);
            }
        });
}
