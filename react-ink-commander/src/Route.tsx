import { Command, Option } from "commander";
import React, { cloneElement, FC, ReactElement, useMemo } from "react";
import { CommandContext } from "./CommandContext";
import { ComponentWithCommand } from "./ComponentWithCommand";
import { HelpPage } from "./HelpPage";
import { useChildCommand } from "./useChildCommand";

type CommandWithHelp = Command & { helpInjected?: boolean };

export interface RouteProps {
    allowUnknownOption?: boolean;
    enablePositionalOptions?: boolean;
    passThroughOptions?: boolean;
    help?: boolean;
    command?: Command;
    component?: ComponentWithCommand;
    element?: ReactElement<unknown, ComponentWithCommand>;
    args?: string[];
}

const Route: FC<RouteProps> = (props) => {
    const { args } = props;
    const { command, component } = useMemo(() => getRouteCommand(props), [props]);

    const state = useChildCommand(command);

    const options = useMemo(() => state.command.opts(), [state.command]);

    let child = null;

    if (props.help && options.help) {
        child = <HelpPage />;
    } else {
        child = cloneElement(component, { command, options, args });
    }

    return <CommandContext.Provider value={state}>{child}</CommandContext.Provider>;
};

Route.displayName = "Route";

export { Route };

export function getRouteCommand(props: RouteProps) {
    const {
        command: commandProp,
        component: componentProp,
        element,
        help,
        allowUnknownOption,
        enablePositionalOptions,
        passThroughOptions,
    } = props;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const Component = componentProp!;
    let command = commandProp ?? Component?.command ?? element?.type?.command;
    const component = element ?? <Component />;

    command = command
        .allowUnknownOption(allowUnknownOption)
        .enablePositionalOptions(enablePositionalOptions)
        .passThroughOptions(passThroughOptions)
        .helpOption(false)
        .showSuggestionAfterError(true)
        .showHelpAfterError("(add --help for additional information)");

    if (help && !(command as CommandWithHelp).helpInjected) {
        (command as CommandWithHelp).helpInjected = true;
        command = command.addOption(new Option("-h, --help", "Show help information"));
    }

    return { command, component };
}
