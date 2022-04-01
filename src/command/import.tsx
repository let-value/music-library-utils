import { Command } from "commander";
import { Text } from "ink";
import React from "react";
import { ComponentWithCommand, Route, Switch } from "react-ink-commander";
import { ExportCommand } from "./export";

const command = new Command("import").description("Import command");

const InputCommand: ComponentWithCommand = ({ command, options }) => {
    return (
        <Switch command={command} element={<Text>{JSON.stringify(options)}</Text>}>
            <Route key="export" element={<ExportCommand />} />
        </Switch>
    );
};

InputCommand.command = command;

export { InputCommand };
