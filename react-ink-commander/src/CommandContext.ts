import { Command } from "commander";
import { createContext, MutableRefObject } from "react";

export interface CommandState {
    name: MutableRefObject<string>;
    command: Command;
    setName(path: string): void;
    parent?: CommandState;
    navigationUpdated: React.DispatchWithoutAction;
    updatesCounter: number;
}

export const CommandContext = createContext<CommandState>({} as never);
