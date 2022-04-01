import { Command, Option, OptionValues } from "commander";
import React, { FC, ReactElement, useCallback, useMemo, useRef } from "react";
import flattenChildren from "react-keyed-flatten-children";
import { CommandContext } from "./CommandContext";
import { ComponentWithCommand } from "./ComponentWithCommand";
import { HelpPage } from "./HelpPage";
import { getRouteCommand, RouteProps } from "./Route";
import { useChildCommand } from "./useChildCommand";

type Element = ReactElement<RouteProps, ComponentWithCommand>;

export interface SwitchProps extends RouteProps {
    help?: boolean;
    children: Element | Element[];
}

const Switch: FC<SwitchProps> = (props) => {
    let isError = false;

    const { help, children } = props;
    const childCommands = useMemo(() => new Map<string, Element>(), []);

    const handleError = useCallback(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        isError = true;
    }, []);

    let command = useMemo(() => {
        const { command, component } = getRouteCommand(props);

        command.helpOption(false).showSuggestionAfterError().exitOverride(handleError);
        if (help) {
            command
                .addOption(new Option("-h, --help", "Show help information"))
                .showHelpAfterError("(use --help for additional information)");
        }

        childCommands.set(command.name(), component);

        return command;
    }, [childCommands, handleError, help, props]);

    const state = useChildCommand(command);

    const { parent, name } = state;

    const handleInvoke = useCallback(
        (_: unknown, activeCommand: Command) => {
            name.current = activeCommand.name();
        },
        [name]
    );

    command = useMemo(() => {
        if (parent?.command && !parent?.command.commands.includes(command)) {
            parent.command.addCommand(command);
        }

        return command.action(handleInvoke);
    }, [command, handleInvoke, parent?.command]);

    const flatChildren = useMemo(() => flattenChildren(children) as Element[], [children]);

    for (const element of flatChildren) {
        const { command: childCommand } = getRouteCommand(element.props);

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

        try {
            command.parse(...parseArgs);
        } catch {
            isError = true;
        } finally {
            parsed.current = true;
        }
    }

    let options: OptionValues | undefined = undefined;
    try {
        options = command.opts();
    } catch {
        isError = true;
    }

    let child = null;

    if (!isError && childCommands.has(name.current)) {
        child = childCommands.get(name.current);
    }

    if (!child) {
        isError = true;
    }

    if (isError || (help && options?.help)) {
        child = <HelpPage />;
    }

    return <CommandContext.Provider value={state}>{child}</CommandContext.Provider>;
};

Switch.displayName = "Switch";

export { Switch };
