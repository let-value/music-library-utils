import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Track {
    @PrimaryGeneratedColumn()
    Id!: number;

    @Column()
    Name!: string;

    @Column()
    Artist!: string;

    @Column()
    Album!: string;

    @Column()
    Playlist!: string;

    @Column()
    Type!: string;

    @Column()
    ISRC!: string;
}
