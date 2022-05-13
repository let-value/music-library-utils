import { Command } from "commander";
import { Box, Text } from "ink";
import Link from "ink-link";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { ComponentWithCommand } from "react-ink-commander";
import Container from "typedi";
import { GoBack } from "../../../../components";
import { SpotifyStore } from "../../../../store";
import { Browse } from "../../../browse";
import { SpotifyContext } from "./SpotifyContext";

const command = new Command("spotify").description("Import from Spotify");

const ImportSpotifyCommand = observer((_props) => {
    const [store] = useState(() => Container.get(SpotifyStore));

    useEffect(() => {
        store.init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (store.authServer) {
        return (
            <GoBack>
                <Text>
                    Login url:{" "}
                    <Link fallback={false} url={store.authServer.url}>
                        <Text color="green">{store.authServer.url}</Text>
                    </Link>
                </Text>
            </GoBack>
        );
    }

    if (!store.user) {
        return (
            <GoBack>
                <Text>Please login to Spotify</Text>
            </GoBack>
        );
    }

    return (
        <SpotifyContext.Provider value={store}>
            <Browse
                title={
                    <Box flexDirection="column" paddingX={1} borderStyle="round" borderColor="green">
                        <Text bold>{store.user.display_name} </Text>
                        <Text>{store.user.email}</Text>
                    </Box>
                }
                library={store.provider.library}
            />
        </SpotifyContext.Provider>
    );
}) as ComponentWithCommand;
ImportSpotifyCommand.command = command;

export { ImportSpotifyCommand };
