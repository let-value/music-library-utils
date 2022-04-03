import { Command, OptionValues } from "commander";
import { FC } from "react";

export interface CommandComponentProps {
    command?: Command;
    args?: string[];
    options?: OptionValues;
}

export type ComponentWithCommand<TProps = unknown> = FC<TProps & CommandComponentProps> & {
    command: Command;
};
