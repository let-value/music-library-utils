import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Track } from "./Track.entity";

@Entity()
export class Playlist extends BaseEntity {
    @PrimaryGeneratedColumn()
    Id!: number;

    @Column()
    Name!: string;

    @ManyToMany(() => Track, (track) => track.Playlist)
    @JoinTable()
    Tracks!: Promise<Track[]>;

    constructor(name: string) {
        super();
        this.Name = name;
    }
}
