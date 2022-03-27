import { Command, Option } from "commander";
import React, { FC, ReactElement, useMemo } from "react";
import flattenChildren from "react-keyed-flatten-children";
import { CommandProps } from "./Command";
import { ComponentWithCommand } from "./ComponentWithCommand";
import { HelpPage } from "./HelpPage";
import { RouteContext } from "./RouteContext";
import { useSwitchRoute } from "./useSwitchRoute";

type Element = ReactElement<CommandProps, ComponentWithCommand>;

export interface SwitchProps {
    element: Element;
    help?: boolean;
    children: Element | Element[];
}

export const Switch: FC<SwitchProps> = ({ element, help, children }) => {
    const commands = useMemo(() => new Map<string, Element>(), []);

    const program = useMemo(() => {
        let program = (element.type.command ?? new Command()).helpOption(false);
        commands.set(program.name(), element);

        if (help) {
            program = program.addOption(new Option("-h, --help", "Show help information"));
        }

        return program;
    }, [element, help]);

    const { path, parentState, handleInvoke, handlePath, triggerParse } = useSwitchRoute(program);

    const flatChildren = useMemo(() => flattenChildren(children) as Element[], [children]);

    for (const element of flatChildren) {
        const command =
            element?.props?.command ?? element?.props?.element?.type?.command ?? element?.props?.component?.command;

        const name = command?.name();
        if (name && command && !commands.has(name)) {
            commands.set(name, element);
            program.addCommand(command.action(handleInvoke.bind(undefined, command)));
        }
    }

    triggerParse();

    const options = program.opts();
    let child = null;

    console.log(path);
    if (commands.has(path.current!)) {
        child = commands.get(path.current!);
    }

    if (help && (options.help || child == null)) {
        child = <HelpPage />;
    }

    return (
        <RouteContext.Provider
            value={{
                ...parentState,
                path: path.current,
                program,
                setPath: handlePath
            }}
        >
            {child}
        </RouteContext.Provider>
    );
};
