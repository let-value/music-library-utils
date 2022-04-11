import { BaseEntity, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { Artist } from "./Artist.entity";
import { Track } from "./Track.entity";

@Entity()
export class Album extends BaseEntity {
    @PrimaryColumn()
    Name!: string;

    @PrimaryColumn()
    artistName!: string;

    @ManyToOne(() => Artist, (artist) => artist.Albums, { cascade: true, eager: true })
    @JoinColumn({ name: "artistName" })
    Artist!: Artist;

    @ManyToMany(() => Track, (track) => track.Albums, { eager: true })
    Tracks!: Track[];

    constructor(params?: Partial<Album>) {
        super();
        Object.assign(this, params);
    }
}
