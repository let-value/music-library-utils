import QuickSearchInput, { Item } from "ink-search-select";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Route, Switch, useNavigation } from "react-ink-commander";
import { Loader } from "../../components";
import { Playlist } from "../../db/entity";
import { BrowsePlaylist } from "./BrowsePlaylist";
import { LibraryContext } from "./LibraryContext";
import { useBrowseCommands } from "./useBrowseCommands";

// interface Props {

// }

export const BrowsePlaylists: FC = () => {
    const library = useContext(LibraryContext);

    const { command, goBack, goToCommand } = useNavigation();
    const { playlist } = useBrowseCommands();
    const [playlists, setPlaylists] = useState<Playlist[] | undefined>(undefined);
    const [selected, selectPlaylist] = useState<Playlist>();

    useEffect(() => {
        (async () => {
            const playlists = await library.getPlaylists();
            setPlaylists(playlists);
        })();
    }, [library]);

    const items = useMemo(
        () => playlists?.map((playlist, index) => ({ value: index, label: `${index + 1}. ${playlist.Name}` })) ?? [],
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
                playlists == undefined ? (
                    <Loader label="Loading playlists" />
                ) : (
                    <QuickSearchInput
                        label="Search playlist"
                        limit={Math.max(rows - 2, 1)}
                        items={items}
                        onSelect={handleSelect}
                        onEscape={goBack}
                    />
                )
            }
        >
            {selected && <Route key="playlist" command={playlist} element={<BrowsePlaylist playlist={selected} />} />}
        </Switch>
    );
};
