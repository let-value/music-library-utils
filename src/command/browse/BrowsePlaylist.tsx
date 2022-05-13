import { Text } from "ink";
import React, { FC } from "react";
import { Playlist } from "../../db/entity";
import { ILibrary } from "../../provider/Library";

interface Props {
    playlist: Playlist;
    library: ILibrary;
}

export const BrowsePlaylist: FC<Props> = ({ playlist }) => {
    return <Text>{playlist.Name}</Text>;

    // const { command } = useNavigation();
    // const { tracks } = useBrowseCommands();

    // return (
    //     <Switch command={command} element={<QuickSearchInput limit={rows} items={items} onSelect={handleSelect} />}>
    //         <Route key="tracks" command={tracks} element={<Playlist playlist={selected} library={library} />} />
    //     </Switch>
    // );
};
