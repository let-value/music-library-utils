import { Command } from "commander";
import { Text } from "ink";
import React from "react";
import { ComponentWithCommand } from "../components";

const InputCommand: ComponentWithCommand = () => {
    return <Text>input command</Text>;
};

InputCommand.command = new Command("import").description("Import command");

export { InputCommand };
