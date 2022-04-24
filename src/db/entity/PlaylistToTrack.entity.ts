import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Album } from "./Album.entity";
import { Playlist } from "./Playlist.entity";
import { Track } from "./Track.entity";

@Entity()
export class PlaylistToTrack {
    @PrimaryColumn()
    Order!: number;

    @PrimaryColumn()
    playlistId!: number;

    @PrimaryColumn()
    trackName!: string;

    @PrimaryColumn()
    albumName?: string;

    @PrimaryColumn()
    trackArtistName!: string;

    @ManyToOne(() => Playlist, (playlist) => playlist.Tracks)
    Playlist!: Playlist;

    @ManyToOne(() => Track, (track) => track.Playlists, { eager: true })
    Track!: Track;

    @ManyToOne(() => Album, { eager: true })
    Album?: Album;

    @CreateDateColumn()
    AddedAt!: Date;

    constructor(params?: Partial<PlaylistToTrack>) {
        Object.assign(this, params);
    }
}
