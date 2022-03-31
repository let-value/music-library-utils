import { Controller, Get } from "routing-controllers";

@Controller()
export class TracksController {
    @Get("/tracks")
    getAll() {
        return "This action returns all tracks";
    }
}
