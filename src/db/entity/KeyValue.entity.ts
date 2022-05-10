import { Column, Entity, PrimaryColumn } from "typeorm";

export type Keys = "spotifyAccessToken" | "spotifyRefreshToken";

@Entity()
export class KeyValue {
    @PrimaryColumn()
    key!: Keys;

    @Column({ nullable: true })
    value?: string;
}
