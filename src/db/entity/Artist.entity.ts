import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Album } from "./Album.entity";
import { Track } from "./Track.entity";

@Entity()
export class Artist {
    @PrimaryColumn()
    Name!: string;

    @OneToMany(() => Album, (album) => album.Artist)
    Albums!: Promise<Album[]>;

    @OneToMany(() => Track, (track) => track.Artist)
    Tracks!: Promise<Track[]>;

    constructor(params?: Partial<Artist>) {
        Object.assign(this, params);
    }
}
