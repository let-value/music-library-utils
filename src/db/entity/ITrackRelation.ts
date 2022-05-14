import { Track } from "./Track.entity";

export interface ITrackRelation {
    Track: Track;
    AddedAt: Date;
}
