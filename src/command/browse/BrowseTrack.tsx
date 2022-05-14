import { Command } from "commander";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import { Item } from "ink-select-input/build/SelectInput";
import React, { FC, useCallback, useContext, useMemo } from "react";
import { Route, Switch, useNavigation } from "react-ink-commander";
import { MenuCommand, TrackName, useCommandMenu, useNavigationCommandMenuItems } from "../../components";
import { Track } from "../../db/entity";
import { LibraryFeature } from "../../provider/Library";
import { LibraryContext } from "./LibraryContext";
import { useBrowseCommands } from "./useBrowseCommands";

interface Props {
    track: Track;
}

type Commands = MenuCommand | "import" | "remove";

export const BrowseTrack: FC<Props> = ({ track }) => {
    const library = useContext(LibraryContext);
    const { command } = useNavigation();
    const { artist, album } = useBrowseCommands();

    const navItems = useNavigationCommandMenuItems();
    const menuItems = useMemo(() => {
        const result: Item<Command | Commands>[] = [];
        if (library.features.includes(LibraryFeature.import_playlist)) {
            result.push({
                key: "import",
                label: "import",
                value: "import",
            });
        }
        if (library.features.includes(LibraryFeature.remove_playlist)) {
            result.push({
                key: "remove",
                label: "remove",
                value: "remove",
            });
        }
        return result.concat(navItems);
    }, [library.features, navItems]);
    const handleSelectCommand = useCallback((option: Item<Command | Commands>) => {
        console.log(option.value);
    }, []);
    const { items, handleSelect } = useCommandMenu<Commands>(menuItems, handleSelectCommand, {
        back: true,
        exit: true,
    });

    return (
        <Switch
            command={command}
            element={
                <Box flexDirection="column">
                    <Text>
                        Track: <TrackName track={track} />
                    </Text>
                    <SelectInput items={items} onSelect={handleSelect} />
                </Box>
            }
        >
            <Route key="artist" command={artist} element={<Text>artist</Text>} />
            <Route key="album" command={album} element={<Text>album</Text>} />
        </Switch>
    );
};
