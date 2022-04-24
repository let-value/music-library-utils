import { Command } from "commander";
import { Box, Text } from "ink";
import React from "react";
import { CommandRouter, Route, Switch } from "react-ink-commander";
import project from "../package.json";
import { ExportCommand, ImportCommand, WebUICommand } from "./command";
import { CommandMenu, DataBaseProvider } from "./components";

const command = new Command(project.name).description(project.description).version(project.version);

export const App = () => {
    return (
        <DataBaseProvider>
            <Box flexDirection="column">
                <Text>{command.name()}</Text>
                <CommandRouter>
                    <Switch
                        help
                        allowUnknownOption
                        enablePositionalOptions
                        passThroughOptions
                        command={command}
                        element={<CommandMenu exit />}
                    >
                        <Route key="import" element={<ImportCommand />} />
                        <Route key="export" element={<ExportCommand />} />
                        <Route key="webui" element={<WebUICommand />} />
                    </Switch>
                </CommandRouter>
            </Box>
        </DataBaseProvider>
    );
};
