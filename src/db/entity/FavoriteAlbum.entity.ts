import { CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Album } from "./Album.entity";

@Entity()
export class FavoriteAlbum {
    @PrimaryGeneratedColumn()
    Id!: number;

    @OneToOne(() => Album)
    @JoinColumn()
    Album!: Album;

    @CreateDateColumn()
    CreatedAt!: Date;
}
