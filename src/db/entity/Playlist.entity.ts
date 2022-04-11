import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlaylistToTrack } from "./PlaylistToTrack.entity";

@Entity()
export class Playlist extends BaseEntity {
    @PrimaryGeneratedColumn()
    Id!: number;

    @Column()
    Name!: string;

    @OneToMany(() => PlaylistToTrack, (playlist_track) => playlist_track.Playlist, { cascade: true, lazy: true })
    Tracks!: Promise<PlaylistToTrack[]>;

    @CreateDateColumn()
    CreatedAt!: Date;

    constructor(name: string) {
        super();
        this.Name = name;
    }
}
