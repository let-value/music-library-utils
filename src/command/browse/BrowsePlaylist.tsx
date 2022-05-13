import { Command } from "commander";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import { Item } from "ink-select-input/build/SelectInput";
import React, { FC, useCallback, useMemo } from "react";
import { Route, Switch, useNavigation } from "react-ink-commander";
import { MenuCommand, useCommandMenu, useNavigationCommandMenuItems } from "../../components";
import { Playlist } from "../../db/entity";
import { ILibrary, LibraryFeature } from "../../provider/Library";
import { useBrowseCommands } from "./useBrowseCommands";

interface Props {
    playlist: Playlist;
    library: ILibrary;
}

type Commands = MenuCommand | "import" | "rename" | "remove";

export const BrowsePlaylist: FC<Props> = ({ playlist, library }) => {
    const { command } = useNavigation();
    const { tracks } = useBrowseCommands();

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
        if (library.features.includes(LibraryFeature.edit_playlist)) {
            result.push({
                key: "rename",
                label: "rename",
                value: "rename",
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
                    <Text>Playlist: {playlist.Name}</Text>
                    <SelectInput items={items} onSelect={handleSelect} />
                </Box>
            }
        >
            <Route key="tracks" command={tracks} element={<Text>tracks</Text>} />
        </Switch>
    );
};
