import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from "typeorm";
import { Album } from "./Album.entity";
import { Artist } from "./Artist.entity";
import { PlaylistToTrack } from "./PlaylistToTrack.entity";

@Entity()
export class Track extends BaseEntity {
    @PrimaryColumn()
    Name!: string;

    @PrimaryColumn()
    artistName!: string;

    @ManyToOne(() => Artist, (artist) => artist.Tracks, { cascade: true, eager: true })
    @JoinColumn({ name: "artistName", referencedColumnName: "Name" })
    Artist!: Artist;

    @ManyToMany(() => Album, (album) => album.Tracks, { cascade: true, lazy: true, nullable: true })
    @JoinTable()
    Albums?: Promise<Album[]>;

    @OneToMany(() => PlaylistToTrack, (playlist_track) => playlist_track.Track, { cascade: true, lazy: true })
    Playlists!: Promise<PlaylistToTrack[]>;

    @Column({ nullable: true })
    ISRC?: string;

    constructor(params?: Partial<Track>) {
        super();
        Object.assign(this, params);
    }
}
