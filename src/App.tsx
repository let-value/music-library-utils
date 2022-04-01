import { Box, Text } from "ink";
import React from "react";
import { CommandRouter, Route, Switch } from "react-ink-commander";
import { ImportCommand, UICommand } from "./command";
import { MainMenu } from "./command/mainMenu";

export const App = () => {
    return (
        <Box flexDirection="column">
            <Text>{MainMenu.command.name()}</Text>
            <CommandRouter>
                <Switch enablePositionalOptions help element={<MainMenu />}>
                    <Route key="import" passThroughOptions help element={<ImportCommand />} />
                    <Route key="ui" element={<UICommand />} />
                </Switch>
            </CommandRouter>
        </Box>
    );
};
