import { Command } from "commander";
import { Box, Text, useApp } from "ink";
import Gradient from "ink-gradient";
import SelectInput, { ItemProps } from "ink-select-input";
import { Item } from "ink-select-input/build/SelectInput";
import React, { FC, ReactNode, useCallback, useMemo } from "react";
import { useNavigation } from "react-ink-commander";

type MenuCommand = "exit" | "back";

interface CommandMenuProps {
    title?: ReactNode;
    exit?: boolean;
    back?: boolean;
}

const MenuCommandDescription: Record<MenuCommand, string> = {
    exit: "Exit application",
    back: "Go back to previous menu",
};

const CommandMenu: FC<CommandMenuProps> = ({ title, exit, back }) => {
    const app = useApp();
    const { commands, goToCommand, goBack } = useNavigation();

    const items = useMemo(() => {
        let index = 0;
        const result: Item<Command | MenuCommand>[] = [];

        for (const command of commands) {
            result.push({ key: (index++).toString(), label: command.name(), value: command });
        }
        if (back) {
            result.push({ key: "back", label: "back", value: "back" });
        }
        if (exit) {
            result.push({ key: "exit", label: "exit", value: "exit" });
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

    const ItemComponent = useMemo(
        (): FC<ItemProps> =>
            function MenuItem({ isSelected, label }) {
                const item = items.find((item) => item.label == label);
                const description =
                    item?.value instanceof Command
                        ? item.value.description()
                        : MenuCommandDescription[item?.value as MenuCommand];

                const name = label.padEnd(17, " ");

                return (
                    <Text>
                        {isSelected ? <Gradient name="vice">{name}</Gradient> : name}
                        {description}
                    </Text>
                );
            },
        [items]
    );

    return (
        <Box flexDirection="column">
            {title}
            <SelectInput items={items} onSelect={handleSelect} itemComponent={ItemComponent} />
        </Box>
    );
};

export { CommandMenu };
