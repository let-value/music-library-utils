import { Command } from "commander";
import { Box } from "ink";
import BigText from "ink-big-text";
import Gradient from "ink-gradient";
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
                        <Route key="webui" element={<WebUICommand />} />
                    </Switch>
                </CommandRouter>
            </Box>
        </DataBaseProvider>
    );
};
