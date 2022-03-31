import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Track } from "./Track.entity";

@Entity()
export class Playlist {
    @PrimaryGeneratedColumn()
    Id!: number;

    @Column()
    Name!: string;

    @ManyToMany(() => Track, (track) => track.Playlist, { eager: true })
    @JoinTable()
    Tracks!: Track[];

    constructor(name: string) {
        this.Name = name;
    }
}
