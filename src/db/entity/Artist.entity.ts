import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Album } from "./Album.entity";
import { Track } from "./Track.entity";

@Entity()
export class Artist {
    @PrimaryColumn()
    Name!: string;

    @OneToMany(() => Album, (album) => album.Artist)
    Albums!: Album[];

    @OneToMany(() => Track, (track) => track.Artist)
    Tracks!: Track[];
}
