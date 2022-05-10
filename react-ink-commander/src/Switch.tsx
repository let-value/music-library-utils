import { Command } from "commander";
import React, { FC, ReactElement, useCallback, useMemo, useRef } from "react";
import flattenChildren from "react-keyed-flatten-children";
import { CommandContext } from "./CommandContext";
import { ComponentWithCommand } from "./ComponentWithCommand";
import { getRouteCommand, Route, RouteProps } from "./Route";
import { useChildCommand } from "./useChildCommand";

type Element = ReactElement<RouteProps, ComponentWithCommand>;

export interface SwitchProps extends RouteProps {
    children?: Element | Element[];
}

const Switch: FC<SwitchProps> = ({ children, ...props }) => {
    const childCommands = useMemo(() => new Map<string, Element>(), []);
    const mainElement = useMemo(() => <Route {...props} />, [props]);
    let command = useMemo(() => {
        const { command } = getRouteCommand(props);

        childCommands.set(command.name(), mainElement);

        return command;
    }, [childCommands, mainElement, props]);

    const state = useChildCommand(command);

    const { parent, name } = state;

    const handleInvoke = useCallback(
        (activeCommand: Command) => {
            const newName = activeCommand.name();
            name.current = newName;
        },
        [name]
    );

    command = useMemo(() => {
        if (parent?.command && !parent?.command.commands.some((x) => x.name() == command.name())) {
            parent.command.addCommand(command);
        }

        return command.action(handleInvoke.bind(undefined, command));
    }, [command, handleInvoke, parent?.command]);

    const flatChildren = useMemo(() => flattenChildren(children) as Element[], [children]);

    for (const element of flatChildren) {
        const { command: childCommand } = getRouteCommand(element.props);

        const name = childCommand?.name();
        if (name && childCommand && !childCommands.has(name)) {
            childCommand.action(handleInvoke.bind(undefined, childCommand));

            if (!command.commands.some((x) => x.name() == childCommand.name())) {
                command.addCommand(childCommand);
            }

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
        } catch (error) {
            console.error(error);
        } finally {
            parsed.current = true;
        }
    }

    let child = childCommands.get(name.current) ?? mainElement;

    if (props.help && command.opts().help) {
        child = mainElement;
    }

    return <CommandContext.Provider value={state}>{child ?? null}</CommandContext.Provider>;
};

Switch.displayName = "Switch";

export { Switch };
