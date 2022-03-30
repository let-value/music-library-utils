import { Command, Option } from "commander";
import React, { FC, ReactElement, useMemo } from "react";
import flattenChildren from "react-keyed-flatten-children";
import { CommandProps, getComponentCommand } from "./Command";
import { ComponentWithCommand } from "./ComponentWithCommand";
import { HelpPage } from "./HelpPage";
import { RouteContext } from "./RouteContext";
import { useRoute } from "./useSwitchRoute";

type Element = ReactElement<CommandProps, ComponentWithCommand>;

export interface SwitchProps extends CommandProps {
    help?: boolean;
    children: Element | Element[];
}

export const Switch: FC<SwitchProps> = (props) => {
    const { help, children } = props;
    const childCommands = useMemo(() => new Map<string, Element>(), []);

    const command = useMemo(() => {
        const { command = new Command(), component } = getComponentCommand(props);

        command.helpOption(false);
        if (help) {
            command.addOption(new Option("-h, --help", "Show help information"));
        }

        childCommands.set(command.name(), component);

        return command;
    }, [childCommands, help, props]);

    const { path, parentState, handleInvoke, handlePath, parseCommands } = useRoute(command);

    const flatChildren = useMemo(() => flattenChildren(children) as Element[], [children]);

    for (const element of flatChildren) {
        const { command: childCommand, component } = getComponentCommand(element.props);

        const name = childCommand?.name();
        if (name && childCommand && !childCommands.has(name)) {
            childCommand.action(handleInvoke.bind(undefined, childCommand));

            command.addCommand(childCommand);
            childCommands.set(name, component);
        }
    }

    parseCommands();

    const options = command.opts();
    let child = null;

    if (childCommands.has(path.current)) {
        child = childCommands.get(path.current);
    }

    if (help && (options.help || child == null)) {
        child = <HelpPage />;
    }

    console.log(path, childCommands.keys());

    return (
        <RouteContext.Provider
            value={{
                ...parentState,
                path: path.current,
                command,
                setPath: handlePath,
            }}
        >
            {child}
        </RouteContext.Provider>
    );
};
