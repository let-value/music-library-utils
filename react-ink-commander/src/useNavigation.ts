import { Command } from "commander";
import { useCallback, useContext, useMemo } from "react";
import { CommandContext } from "./CommandContext";

export function useNavigation() {
    const context = useContext(CommandContext);
    const { parent, command, setName, updatesCounter } = context ?? {};

    const commands = useMemo(() => {
        return command?.commands ?? [];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [command?.commands, updatesCounter]);

    const goToCommand = useCallback(
        (command: Command) => {
            setName?.(command.name());
        },
        [setName]
    );

    const goBack = useCallback(() => {
        command?.parseAsync([]);
        parent?.setName?.(parent?.command?.name());
    }, [command, parent]);

    return { command, commands, goToCommand, goBack };
}
