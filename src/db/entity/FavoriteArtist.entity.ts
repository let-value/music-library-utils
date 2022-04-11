import { CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Artist } from "./Artist.entity";

@Entity()
export class FavoriteArtist {
    @PrimaryGeneratedColumn()
    Id!: number;

    @OneToOne(() => Artist)
    @JoinColumn()
    Artist!: Artist;

    @CreateDateColumn()
    CreatedAt!: Date;
}
