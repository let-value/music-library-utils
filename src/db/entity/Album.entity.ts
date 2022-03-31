import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Artist } from "./Artist.entity";
import { Track } from "./Track.entity";

@Entity()
export class Album {
    @PrimaryGeneratedColumn()
    Id!: number;

    @Column()
    Name!: string;

    @ManyToOne(() => Artist, (artist) => artist.Albums)
    Artist!: Artist;

    @OneToMany(() => Track, (track) => track.Playlist)
    Tracks!: Track[];
}
