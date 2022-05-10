import { Command } from "commander";
import { Box, Text } from "ink";
import Link from "ink-link";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { ComponentWithCommand, Route, Switch } from "react-ink-commander";
import Container from "typedi";
import { CommandMenu, GoBack } from "../../../../components";
import { SpotifyStore } from "../../../../store";
import { SpotifyBrowseCommand } from "./SpotifyBrowseCommand";
import { SpotifyContext } from "./SpotifyContext";

const command = new Command("spotify").description("Import from Spotify");

const ImportSpotifyCommand = observer((_props) => {
    const [provider] = useState(() => Container.get(SpotifyStore));

    useEffect(() => {
        provider.init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (provider.authServer) {
        return (
            <GoBack>
                <Text>
                    Login url:{" "}
                    <Link fallback={false} url={provider.authServer.url}>
                        <Text color="green">{provider.authServer.url}</Text>
                    </Link>
                </Text>
            </GoBack>
        );
    }

    if (!provider.user) {
        return (
            <GoBack>
                <Text>Please login to Spotify</Text>
            </GoBack>
        );
    }

    return (
        <SpotifyContext.Provider value={provider}>
            <Switch
                command={command}
                element={
                    <CommandMenu
                        title={
                            <Box flexDirection="column" paddingX={1} borderStyle="round" borderColor="green">
                                <Text bold>{provider.user.display_name} </Text>
                                <Text>{provider.user.email}</Text>
                            </Box>
                        }
                        back
                        exit
                    />
                }
            >
                <Route key="browse" component={SpotifyBrowseCommand} />
            </Switch>
        </SpotifyContext.Provider>
    );
}) as ComponentWithCommand;
ImportSpotifyCommand.command = command;

export { ImportSpotifyCommand };
