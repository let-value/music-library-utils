import React, { FC } from "react";
import { Route, Switch, useNavigation } from "react-ink-commander";
import { CommandMenu } from "../../components";
import { ILibrary, LibraryFeature } from "../../provider/Library";
import { BrowsePlaylists } from "./BrowsePlaylists";
import { BrowseTracks } from "./BrowseTracks";
import { LibraryContext } from "./LibraryContext";
import { useBrowseCommands } from "./useBrowseCommands";

interface BrowseProps {
    library: ILibrary;
    title?: React.ReactNode;
}

export const Browse: FC<BrowseProps> = ({ title, library, children }) => {
    const { command } = useNavigation();
    const { playlists, tracks } = useBrowseCommands();

    return (
        <LibraryContext.Provider value={library}>
            <Switch help command={command} element={<CommandMenu title={title} back exit />}>
                {library.features.includes(LibraryFeature.favorite_tracks) ? (
                    <Route
                        key="tracks"
                        command={tracks}
                        element={<BrowseTracks source={() => library.getFavoriteTracks()} />}
                    />
                ) : undefined}
                {library.features.includes(LibraryFeature.playlists) ? (
                    <Route key="playlists" command={playlists} element={<BrowsePlaylists />} />
                ) : undefined}
                {children}
            </Switch>
        </LibraryContext.Provider>
    );
};
