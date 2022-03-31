import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Album } from "./Album.entity";
import { Artist } from "./Artist.entity";
import { Playlist } from "./Playlist.entity";

@Entity()
export class Track {
    @PrimaryGeneratedColumn()
    Id!: number;

    @Column()
    Name!: string;

    @ManyToOne(() => Artist, (artist) => artist.Tracks, { cascade: true, eager: true })
    @JoinTable()
    Artist!: Artist;

    @ManyToOne(() => Album, (album) => album.Tracks, { eager: true, nullable: true })
    @JoinTable()
    Album?: Album;

    @ManyToMany(() => Playlist, (playlist) => playlist.Tracks)
    Playlist!: Promise<Playlist[]>;

    @Column({ nullable: true })
    ISRC?: string;

    constructor(params?: Partial<Track>) {
        Object.assign(this, params);
    }
}
