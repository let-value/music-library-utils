import { Command } from "commander";
import { useContext, useReducer } from "react";
import { CommandContext, CommandState } from "./CommandContext";
import { useMutableState } from "./useMutableState";

export function useChildCommand(command: Command): CommandState {
    const parent = useContext(CommandContext);

    const [updatesCounter, navigationUpdated] = useReducer((state: number) => state + 1, 0);
    const [name, setName] = useMutableState<string>(command.name());

    if (parent?.command === command) {
        return parent;
    }

    return { setName, parent, name, command, navigationUpdated, updatesCounter };
}
