import { Command as CommanderCommand } from "commander";
import React, { FC, ReactElement } from "react";
import { ComponentWithCommand } from "./ComponentWithCommand";

export interface CommandProps {
    command?: CommanderCommand;
    component?: ComponentWithCommand;
    element?: ReactElement<any, ComponentWithCommand>;
}

export const Command: FC<CommandProps> = ({ component: Component, element, children }) => {
    if (Component) {
        return <Component />;
    }

    if (element) {
        return element;
    }

    return <>{children}</>;
};
