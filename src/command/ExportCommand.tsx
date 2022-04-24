import { Command } from "commander";
import React from "react";
import { ComponentWithCommand, Route, Switch } from "react-ink-commander";
import { CommandMenu } from "../components";
import { ExportCSVCommand } from "./providers/export";

const command = new Command("export").description("Export library");

const ExportCommand: ComponentWithCommand = () => {
    return (
        <Switch help command={command} element={<CommandMenu back exit />}>
            <Route key="csv" help element={<ExportCSVCommand />} />
        </Switch>
    );
};

ExportCommand.command = command;

export { ExportCommand };
