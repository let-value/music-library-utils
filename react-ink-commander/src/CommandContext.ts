import { Command } from "commander";
import { createContext, MutableRefObject } from "react";

export interface CommandState {
    name: MutableRefObject<string>;
    command: Command;
    setName(path: string): void;
    parent?: CommandState;
}

export const CommandContext = createContext<CommandState>({} as never);
