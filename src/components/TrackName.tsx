import { Text } from "ink";
import React, { FC } from "react";
import { Track } from "../db/entity";

interface Props {
    track: Track;
}

export function formatTrackName(track: Track) {
    return `${track.Artist.Name} - ${track.Name}`;
}

export const TrackName: FC<Props> = ({ track }) => {
    return <Text>{formatTrackName(track)}</Text>;
};
