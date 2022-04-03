import { Command } from "commander";
import { useApp } from "ink";
import SelectInput from "ink-select-input";
import { Item } from "ink-select-input/build/SelectInput";
import React, { FC, useCallback, useMemo } from "react";
import { useNavigation } from "react-ink-commander";

type MenuCommand = "exit" | "back";

interface CommandMenuProps {
    exit?: boolean;
    back?: boolean;
}

const CommandMenu: FC<CommandMenuProps> = ({ exit, back }) => {
    const app = useApp();
    const { commands, goToCommand, goBack } = useNavigation();

    const items = useMemo(() => {
        const result: Item<Command | MenuCommand>[] = [];
        for (const command of commands) {
            result.push({ key: command.name(), label: command.name(), value: command });
        }
        if (back) {
            result.push({ key: "back", label: "Back", value: "back" });
        }
        if (exit) {
            result.push({ key: "exit", label: "Exit", value: "exit" });
        }
        return result;
    }, [back, commands, exit]);

    const handleSelect = useCallback(
        (option: Item<Command | MenuCommand>) => {
            if (option.value == "exit") {
                app.exit();
            }

            if (option.value == "back") {
                goBack();
            }

            if (option.value instanceof Command) {
                goToCommand(option.value);
            }
        },
        [app, goBack, goToCommand]
    );

    return <SelectInput items={items} onSelect={handleSelect} />;
};

export { CommandMenu };
