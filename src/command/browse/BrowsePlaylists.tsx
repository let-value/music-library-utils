import QuickSearchInput, { Item } from "ink-search-select";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Route, Switch, useNavigation } from "react-ink-commander";
import { Playlist } from "../../db/entity";
import { ILibrary } from "../../provider/Library";
import { BrowsePlaylist } from "./BrowsePlaylist";
import { useBrowseCommands } from "./useBrowseCommands";

interface Props {
    library: ILibrary;
}

export const BrowsePlaylists: FC<Props> = ({ library }) => {
    const { command, goBack, goToCommand } = useNavigation();
    const { playlist } = useBrowseCommands();
    const [playlists, setPlaylists] = useState<Playlist[]>();
    const [selected, selectPlaylist] = useState<Playlist>();

    useEffect(() => {
        (async () => {
            const playlists = await library.getPlaylists();
            setPlaylists(playlists);
        })();
    }, [library]);

    const items = useMemo(
        () =>
            Array.from(playlists?.entries() ?? []).map(([index, playlist]) => ({ value: index, label: playlist.Name })),
        [playlists]
    );

    const [, rows] = useStdoutDimensions();

    const handleSelect = useCallback(
        (item: Item) => {
            if (item?.value == undefined || typeof item.value != "number") {
                return;
            }
            selectPlaylist(playlists?.[item.value]);
            goToCommand(playlist);
        },
        [goToCommand, playlist, playlists]
    );

    return (
        <Switch
            command={command}
            element={
                <QuickSearchInput
                    label="Search playlist"
                    limit={Math.max(rows - 2, 1)}
                    items={items}
                    onSelect={handleSelect}
                    onEscape={goBack}
                />
            }
        >
            {selected && (
                <Route
                    key="playlist"
                    command={playlist}
                    element={<BrowsePlaylist playlist={selected} library={library} />}
                />
            )}
        </Switch>
    );
};
