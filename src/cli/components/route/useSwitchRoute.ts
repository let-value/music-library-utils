import { Command } from 'commander';
import { useContext, useRef } from 'react';
import { useForceUpdate } from '../../../utils/useForceUpdate';
import { RouteContext } from './RouteContext';

export function useSwitchRoute(program: Command) {
    const parentState = useContext(RouteContext);

    const forceUpdate = useForceUpdate();

    const path = useRef<string>();

    const handlePath = (value: string) => {
        path.current = value;
        forceUpdate();
    };

    const handleInvoke = (command: Command) => {
        path.current = command.name();
    };

    program.action(handleInvoke.bind(undefined, program));

    if (parentState?.program && !parentState?.program.commands.includes(program)) {
        parentState.program.addCommand(program);
    }

    const parsed = useRef(false);
    const triggerParse = () => {
        if (!parsed.current) {
            program.parse();
            parsed.current = true;
        }
    };

    return { handlePath, handleInvoke, parentState, path, triggerParse };
}
