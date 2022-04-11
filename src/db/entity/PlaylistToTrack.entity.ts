import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";
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
    trackArtistName!: string;

    @ManyToOne(() => Playlist, (playlist) => playlist.Tracks)
    Playlist!: Playlist;

    @ManyToOne(() => Track, (track) => track.Playlists)
    Track!: Track;

    @CreateDateColumn()
    AddedAt!: Date;

    constructor(params?: Partial<PlaylistToTrack>) {
        Object.assign(this, params);
    }
}
