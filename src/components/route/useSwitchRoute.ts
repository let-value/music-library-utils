import { Command } from 'commander';
import { useContext, useRef } from 'react';
import { useForceUpdate } from '../../utils/useForceUpdate';
import { RouteContext } from './RouteContext';

export function useRoute(command: Command) {
    const parentState = useContext(RouteContext);

    const forceUpdate = useForceUpdate();

    const path = useRef<string>(command.name());

    const handlePath = (value: string) => {
        path.current = value;
        forceUpdate();
    };

    const handleInvoke = (command: Command) => {
        console.log(`Invoking ${command.name()}`);
        path.current = command.name();
    };

    command.action(handleInvoke.bind(undefined, command));

    if (parentState?.command && !parentState?.command.commands.includes(command)) {
        parentState.command.addCommand(command);
    }

    const parsed = useRef(false);
    const parseCommands = () => {
        if (!parsed.current) {
            console.log(command.name(), 'parseCommands');
            command.parse();
            parsed.current = true;
        }
    };

    return { handlePath, handleInvoke, parentState, path, parseCommands };
}
