import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { Album } from "./Album.entity";
import { Artist } from "./Artist.entity";
import { Playlist } from "./Playlist.entity";

@Entity()
export class Track extends BaseEntity {
    @PrimaryColumn()
    Name!: string;

    @PrimaryColumn()
    artistName!: string;

    @ManyToOne(() => Artist, (artist) => artist.Tracks, { cascade: true, eager: true })
    @JoinColumn({ name: "artistName", referencedColumnName: "Name" })
    Artist!: Artist;

    @ManyToMany(() => Album, (album) => album.Tracks, { cascade: true, eager: true, nullable: true })
    @JoinTable()
    Albums?: Album[];

    @ManyToMany(() => Playlist, (playlist) => playlist.Tracks)
    Playlist!: Promise<Playlist[]>;

    @Column({ nullable: true })
    ISRC?: string;

    constructor(params?: Partial<Track>) {
        super();
        Object.assign(this, params);
    }
}
