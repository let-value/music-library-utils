import { Command } from "commander";
import { useContext, useState } from "react";
import { CommandContext, CommandState } from "./CommandContext";

export function useChildCommand(command: Command): CommandState {
    const parent = useContext(CommandContext);

    const [name, setName] = useState<string>(command.name());

    if (parent?.command === command) {
        return parent;
    }

    return { setName, parent, name, command };
}
