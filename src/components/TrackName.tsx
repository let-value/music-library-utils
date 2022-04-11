import { Text } from "ink";
import React, { FC } from "react";
import { Track } from "../db/entity";

interface Props {
    track: Track;
}

export const TrackName: FC<Props> = ({ track }) => {
    return (
        <Text>
            {track.Artist.Name} - {track.Name}
        </Text>
    );
};
