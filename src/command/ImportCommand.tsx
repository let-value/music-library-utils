import { Command } from "commander";
import React from "react";
import { ComponentWithCommand, Route, Switch } from "react-ink-commander";
import { CommandMenu } from "../components";
import { ImportCSVCommand, ImportSpotifyCommand } from "./providers/import";

const command = new Command("import").description("Import to library");

const ImportCommand: ComponentWithCommand = ({ command }) => {
    return (
        <Switch help command={command} element={<CommandMenu back exit />}>
            <Route key="csv" help element={<ImportCSVCommand />} />
            <Route key="spotify" help element={<ImportSpotifyCommand />} />
        </Switch>
    );
};

ImportCommand.command = command;

export { ImportCommand };
