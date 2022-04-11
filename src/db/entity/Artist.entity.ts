import { BaseEntity, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Album } from "./Album.entity";
import { Track } from "./Track.entity";

@Entity()
export class Artist extends BaseEntity {
    @PrimaryColumn()
    Name!: string;

    @OneToMany(() => Album, (album) => album.Artist)
    Albums!: Promise<Album[]>;

    @OneToMany(() => Track, (track) => track.Artist)
    Tracks!: Promise<Track[]>;

    constructor(name: string) {
        super();
        this.Name = name;
    }
}
