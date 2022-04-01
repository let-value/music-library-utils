import { Command } from "commander";
import SelectInput from "ink-select-input";
// tslint:disable-next-line: no-submodule-imports
import { Item } from "ink-select-input/build/SelectInput";
import React, { FC } from "react";

interface CommandMenuProps {
    program: Command;
    onSelect(value: Command): void;
}

export const CommandMenu: FC<CommandMenuProps> = ({ program, onSelect }) => {
    const items = program.commands.map((command) => ({ key: command.name(), label: command.name(), value: command }));
    const handleSelect = (option: Item<Command>) => {
        onSelect(option.value);
    };
    return <SelectInput items={items} onSelect={handleSelect} />;
};
