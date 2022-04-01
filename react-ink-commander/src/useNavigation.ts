import { Command } from "commander";
import { useCallback, useContext, useMemo } from "react";
import { CommandContext } from "./CommandContext";

export function useNavigation() {
    const { parent, command, setName } = useContext(CommandContext);

    const commands = useMemo(() => command?.commands ?? [], [command?.commands]);

    const goToCommand = useCallback(
        (command: Command) => {
            setName(command.name());
        },
        [setName]
    );

    const goBack = useCallback(() => {
        parent?.setName(parent?.command?.name());
    }, [parent]);

    return { commands, goToCommand, goBack };
}
