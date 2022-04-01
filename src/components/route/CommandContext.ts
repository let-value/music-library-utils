import { Command } from "commander";
import { createContext } from "react";

export interface CommandState {
    name: string;
    command: Command;
    setName(path: string): void;
    parent?: CommandState;
}

export const CommandContext = createContext<CommandState>({} as never);
