import { Controller, Get, Post } from "routing-controllers";
import { Service } from "typedi";
import { DataBase, DataSource } from "../../db";
import { Artist, Track } from "../../db/entity";

@Controller("/tracks")
@Service()
export class TracksController {
    constructor(@DataBase() private dataSource: DataSource) {}

    @Get()
    async getAll() {
        const tracks = await this.dataSource.getRepository(Track).createQueryBuilder("track").getMany();
        return JSON.stringify(tracks);
    }

    @Post()
    async createTrack() {
        const result = await this.dataSource
            .getRepository(Track)
            .save(new Track({ Name: "track", Artist: new Artist({ Name: "artist" }) }));

        return JSON.stringify(result);
    }
}
