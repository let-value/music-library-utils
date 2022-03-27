import { Command } from "commander";
import { Text } from "ink";
import React from "react";
import { ComponentWithCommand } from "../components";

const ExportCommand: ComponentWithCommand = () => {
    return <Text>export command</Text>;
};

ExportCommand.command = new Command("export").description("Export command");

export { ExportCommand };
