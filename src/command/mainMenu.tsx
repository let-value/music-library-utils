import { Command } from "commander";
import SelectInput from "ink-select-input";
import { Item } from "ink-select-input/build/SelectInput";
import React, { useContext } from "react";
import project from "../../package.json";
import { ComponentWithCommand, RouteContext } from "../components";

const MainMenu: ComponentWithCommand = () => {
    const state = useContext(RouteContext);

    const items =
        state.command?.commands.map((command) => ({ key: command.name(), label: command.name(), value: command })) ??
        [];

    const handleSelect = (option: Item<Command>) => {
        state.setPath?.(option.value.name());
    };

    return <SelectInput items={items} onSelect={handleSelect} />;
};

MainMenu.command = new Command(project.name).description(project.description).version(project.version);

export { MainMenu };
