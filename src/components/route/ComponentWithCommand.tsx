import { Command } from "commander";
import { FC } from "react";

export interface ComponentWithCommand<TProps = any> extends FC<TProps> {
    command: Command;
}
