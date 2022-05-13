import { Command } from "commander";
import { Box, Text } from "ink";
import BigText from "ink-big-text";
import Gradient from "ink-gradient";
import React, { useState } from "react";
import { CommandRouter, Route, Switch } from "react-ink-commander";
import Container from "typedi";
import project from "../package.json";
import { ExportCommand, ImportCommand, WebUICommand } from "./command";
import { Browse } from "./command/browse";
import { CommandMenu, DataBaseProvider } from "./components";
import { Library } from "./provider/Library";

const command = new Command(project.name).description(project.description).version(project.version);
const browseCommand = new Command("browse").description("Browse and manage library");

export const App = () => {
    const [library] = useState(() => Container.get(Library));

    return (
        <DataBaseProvider>
            <Box flexDirection="column">
                <CommandRouter>
                    <Switch
                        help
                        allowUnknownOption
                        enablePositionalOptions
                        passThroughOptions
                        command={command}
                        element={
                            <CommandMenu
                                title={
                                    <Gradient name="morning">
                                        <BigText font="tiny" text={command.name()} />
                                    </Gradient>
                                }
                                exit
                            />
                        }
                    >
                        <Route key="import" element={<ImportCommand />} />
                        <Route key="export" element={<ExportCommand />} />
                        <Route
                            key="browse"
                            command={browseCommand}
                            element={
                                <Browse
                                    title={
                                        <Gradient name="morning">
                                            <Text>Library</Text>
                                        </Gradient>
                                    }
                                    library={library}
                                />
                            }
                        />
                        <Route key="webui" element={<WebUICommand />} />
                    </Switch>
                </CommandRouter>
            </Box>
        </DataBaseProvider>
    );
};
