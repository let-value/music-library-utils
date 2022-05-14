import { Command } from "commander";
import { Box, Text, useApp } from "ink";
import Gradient from "ink-gradient";
import SelectInput, { ItemProps } from "ink-select-input";
import { Item } from "ink-select-input/build/SelectInput";
import React, { FC, ReactNode, useCallback, useMemo } from "react";
import { useNavigation } from "react-ink-commander";

export type MenuCommand = "exit" | "back";

interface CommandMenuProps {
    title?: ReactNode;
    exit?: boolean;
    back?: boolean;
}

export const MenuCommandDescription: Record<MenuCommand, string> = {
    exit: "Exit application",
    back: "Go back to previous menu",
};

export function useNavigationCommandMenuItems() {
    const { commands } = useNavigation();

    return useMemo(() => {
        let index = 0;
        const result: Item<Command>[] = [];

        for (const command of commands) {
            result.push({ key: (index++).toString(), label: command.name(), value: command });
        }

        return result;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commands, commands.length]);
}

export function useCommandMenu<TCommands extends MenuCommand | string>(
    commands?: Item<Command | TCommands>[],
    onSelect?: (option: Item<Command | TCommands>) => void,
    { exit = false, back = false }: Partial<Record<MenuCommand, boolean>> = { exit: false, back: false }
) {
    const app = useApp();
    const { goBack, goToCommand } = useNavigation();

    const items = useMemo(() => {
        const result: Item<Command | TCommands>[] = [...(commands ?? [])];

        if (back) {
            result.push({ key: "back", label: "back", value: "back" as TCommands });
        }
        if (exit) {
            result.push({ key: "exit", label: "exit", value: "exit" as TCommands });
        }
        return result;
    }, [back, commands, exit]);

    const handleSelect = useCallback(
        (option: Item<Command | TCommands>) => {
            if (option.value == "exit") {
                app.exit();
            } else if (option.value == "back") {
                goBack();
            } else if (option.value instanceof Command) {
                goToCommand(option.value);
            } else {
                onSelect?.(option);
            }
        },
        [app, goBack, goToCommand, onSelect]
    );

    return { items, handleSelect };
}

export const makeCommandMenuItemComponent = <TCommands extends MenuCommand | string>(
    items: Item<Command | TCommands>[],
    descriptions: Record<TCommands, string> = MenuCommandDescription as Record<string, string>
): FC<ItemProps> =>
    function MenuItem({ isSelected, label }) {
        const item = items.find((item) => item.label == label);
        const description =
            item?.value instanceof Command ? item.value.description() : descriptions[item?.value as TCommands];

        const name = label.padEnd(17, " ");

        return (
            <Text>
                {isSelected ? <Gradient name="vice">{name}</Gradient> : name}
                {description}
            </Text>
        );
    };

const CommandMenu: FC<CommandMenuProps> = ({ title, exit, back }) => {
    const commands = useNavigationCommandMenuItems();
    const { items, handleSelect } = useCommandMenu(commands, undefined, { exit, back });
    const ItemComponent = useMemo(() => makeCommandMenuItemComponent(items), [items]);

    return (
        <Box flexDirection="column">
            {title}
            <SelectInput items={items} onSelect={handleSelect} itemComponent={ItemComponent} />
        </Box>
    );
};

export { CommandMenu };
