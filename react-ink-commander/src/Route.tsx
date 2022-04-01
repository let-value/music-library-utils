import { Command } from "commander";
import React, { cloneElement, FC, ReactElement, useMemo } from "react";
import { CommandContext } from "./CommandContext";
import { ComponentWithCommand } from "./ComponentWithCommand";
import { useChildCommand } from "./useChildCommand";

export interface RouteProps {
    command?: Command;
    component?: ComponentWithCommand;
    element?: ReactElement<unknown, ComponentWithCommand>;
}

const Route: FC<RouteProps> = (props) => {
    const { command, component } = useMemo(() => getRouteCommand(props), [props]);

    const state = useChildCommand(command);

    const options = useMemo(() => state.command.opts(), [state.command]);

    return (
        <CommandContext.Provider value={state}>{cloneElement(component, { command, options })}</CommandContext.Provider>
    );
};

Route.displayName = "Route";

export { Route };

export function getRouteCommand(props: RouteProps) {
    const { command: commandProp, component: componentProp, element } = props;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const Component = componentProp!;
    const command = commandProp ?? Component?.command ?? element?.type?.command;
    const component = element ?? <Component />;

    return { command, component };
}
