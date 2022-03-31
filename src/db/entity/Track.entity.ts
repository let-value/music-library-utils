import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Album } from "./Album.entity";
import { Artist } from "./Artist.entity";
import { Playlist } from "./Playlist.entity";

@Entity()
export class Track {
    @PrimaryGeneratedColumn()
    Id!: number;

    @Column()
    Name!: string;

    @ManyToOne(() => Artist, (artist) => artist.Tracks)
    Artist!: Artist;

    @ManyToOne(() => Album, (album) => album.Tracks)
    Album!: Album;

    @ManyToMany(() => Playlist, (playlist) => playlist.Tracks)
    Playlist!: Playlist[];

    @Column()
    ISRC!: string;
}
