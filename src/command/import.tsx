import { Command as CommanderCommand } from "commander";
import { Text } from "ink";
import React from "react";
import { Command, ComponentWithCommand, Switch } from "../components";
import { ExportCommand } from "./export";

const command = new CommanderCommand("import").description("Import command");

const InputCommand: ComponentWithCommand = () => {
    return (
        <Switch command={command} element={<Text>input command</Text>}>
            <Command key="export" element={<ExportCommand />} />
        </Switch>
    );
};

InputCommand.command = command;

export { InputCommand };
