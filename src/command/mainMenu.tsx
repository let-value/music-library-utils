import { Command } from "commander";
import { useApp } from "ink";
import SelectInput from "ink-select-input";
import { Item } from "ink-select-input/build/SelectInput";
import React, { useCallback, useMemo } from "react";
import { ComponentWithCommand, useNavigation } from "react-ink-commander";
import project from "../../package.json";

type MenuCommand = "exit";

const MainMenu: ComponentWithCommand = () => {
    const { exit } = useApp();
    const { commands, goToCommand } = useNavigation();

    const items = useMemo(() => {
        const result: Item<Command | MenuCommand>[] = [];
        for (const command of commands) {
            result.push({ key: command.name(), label: command.name(), value: command });
        }
        result.push({ key: "exit", label: "Exit", value: "exit" });
        return result;
    }, [commands]);

    const handleSelect = useCallback(
        (option: Item<Command | MenuCommand>) => {
            if (option.value == "exit") {
                exit();
            }

            if (option.value instanceof Command) {
                goToCommand(option.value);
            }
        },
        [exit, goToCommand]
    );

    return <SelectInput items={items} onSelect={handleSelect} />;
};

MainMenu.command = new Command(project.name).description(project.description).version(project.version);

export { MainMenu };
