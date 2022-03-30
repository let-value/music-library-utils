import { Command as CommanderCommand } from "commander";
import React, { FC, ReactElement, useMemo } from "react";
import { ComponentWithCommand } from "./ComponentWithCommand";
import { RouteContext } from "./RouteContext";
import { useRoute } from "./useSwitchRoute";

export interface CommandProps {
    command?: CommanderCommand;
    component?: ComponentWithCommand;
    element?: ReactElement<unknown, ComponentWithCommand>;
}

export const Command: FC<CommandProps> = (props) => {
    const { command, component } = useMemo(() => {
        const { command = new CommanderCommand().helpOption(false), component } = getComponentCommand(props);
        return { command, component };
    }, [props]);

    const { path, parentState, handlePath } = useRoute(command);

    return (
        <RouteContext.Provider
            value={{
                ...parentState,
                path: path.current,
                command,
                setPath: handlePath,
            }}
        >
            {component}
        </RouteContext.Provider>
    );
};

export function getComponentCommand(props: CommandProps) {
    const { command: commandProp, component: componentProp, element } = props;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const Component = componentProp!;
    const command = commandProp ?? Component?.command ?? element?.type?.command;
    const component = element ?? <Component />;

    return { command, component };
}
