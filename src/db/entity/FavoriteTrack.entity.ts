import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Track } from "./Track.entity";

@Entity()
export class FavoriteTrack {
    @PrimaryGeneratedColumn()
    Id!: number;

    @OneToOne(() => Track)
    @JoinColumn()
    Track!: Track;
}
