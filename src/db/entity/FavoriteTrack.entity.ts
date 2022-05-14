import { CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ITrackRelation } from "./ITrackRelation";
import { Track } from "./Track.entity";

@Entity()
export class FavoriteTrack implements ITrackRelation {
    @PrimaryGeneratedColumn()
    Id!: number;

    @OneToOne(() => Track)
    @JoinColumn()
    Track!: Track;

    @CreateDateColumn()
    AddedAt!: Date;
}
