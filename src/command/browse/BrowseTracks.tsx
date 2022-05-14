import QuickSearchInput, { Item } from "ink-search-select";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Route, Switch, useNavigation } from "react-ink-commander";
import { formatTrackName, Loader } from "../../components";
import { ITrackRelation } from "../../db/entity";
import { BrowseTrack } from "./BrowseTrack";
import { useBrowseCommands } from "./useBrowseCommands";

interface Props {
    source: () => Promise<ITrackRelation[]>;
}

export const BrowseTracks: FC<Props> = ({ source }) => {
    const { command, goBack, goToCommand } = useNavigation();
    const { track } = useBrowseCommands();
    const [tracks, setTracks] = useState<ITrackRelation[] | undefined>(undefined);
    const [selected, selectTrack] = useState<ITrackRelation>();

    useEffect(() => {
        (async () => {
            const tracks = await source();
            setTracks(tracks);
        })();
    }, [source]);

    const items = useMemo(
        () =>
            tracks?.map((relation, index) => ({
                value: index,
                label: `${index + 1}. ${formatTrackName(relation.Track)}`,
            })) ?? [],
        [tracks]
    );

    const [, rows] = useStdoutDimensions();

    const handleSelect = useCallback(
        (item: Item) => {
            if (item?.value == undefined || typeof item.value != "number") {
                return;
            }
            selectTrack(tracks?.[item.value]);
            goToCommand(track);
        },
        [goToCommand, track, tracks]
    );

    return (
        <Switch
            command={command}
            element={
                tracks == undefined ? (
                    <Loader label="Loading tracks" />
                ) : (
                    <QuickSearchInput
                        label="Search track"
                        limit={Math.max(rows - 2, 1)}
                        items={items}
                        onSelect={handleSelect}
                        onEscape={goBack}
                    />
                )
            }
        >
            {selected && <Route key="track" command={track} element={<BrowseTrack track={selected.Track} />} />}
        </Switch>
    );
};
