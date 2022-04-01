import { Command, Option } from "commander";
import React, { FC, ReactElement, useCallback, useMemo, useRef } from "react";
import flattenChildren from "react-keyed-flatten-children";
import { CommandProps, getComponentCommand } from "./Command";
import { CommandContext } from "./CommandContext";
import { ComponentWithCommand } from "./ComponentWithCommand";
import { HelpPage } from "./HelpPage";
import { useChildCommand } from "./useChildCommand";

type Element = ReactElement<CommandProps, ComponentWithCommand>;

export interface SwitchProps extends CommandProps {
    help?: boolean;
    children: Element | Element[];
}

export const Switch: FC<SwitchProps> = (props) => {
    const { help, children } = props;
    const childCommands = useMemo(() => new Map<string, Element>(), []);

    let command = useMemo(() => {
        const { command = new Command(), component } = getComponentCommand(props);

        command.helpOption(false);
        if (help) {
            command.addOption(new Option("-h, --help", "Show help information"));
        }

        childCommands.set(command.name(), component);

        return command;
    }, [childCommands, help, props]);

    const state = useChildCommand(command);

    const { parent, name, setName } = state;

    const handleInvoke = useCallback(
        (_: unknown, activeCommand: Command) => {
            setName(activeCommand.name());
        },
        [setName]
    );

    command = useMemo(() => {
        if (parent?.command && !parent?.command.commands.includes(command)) {
            parent.command.addCommand(command);
        }

        return command.action(handleInvoke);
    }, [command, handleInvoke, parent?.command]);

    const flatChildren = useMemo(() => flattenChildren(children) as Element[], [children]);

    for (const element of flatChildren) {
        const { command: childCommand } = getComponentCommand(element.props);

        const name = childCommand?.name();
        if (name && childCommand && !childCommands.has(name)) {
            childCommand.action(handleInvoke);

            command.addCommand(childCommand);
            childCommands.set(name, element);
        }
    }

    const parsed = useRef(false);
    if (!parsed.current) {
        const parseArgs: Parameters<Command["parse"]> = command.args?.length
            ? [command.args, { from: "user" }]
            : [undefined, undefined];
        command.parse(...parseArgs);
        parsed.current = true;
    }

    const options = command.opts();
    let child = null;

    if (childCommands.has(name)) {
        child = childCommands.get(name);
    }

    if (help && (options.help || child == null)) {
        child = <HelpPage />;
    }

    return <CommandContext.Provider value={state}>{child}</CommandContext.Provider>;
};
