import { Command } from 'commander';
import { createContext } from 'react';

export interface RouteState {
    path?: string;
    command?: Command;
    setPath?(path: string): void;
}

export const RouteContext = createContext<RouteState>({} as never);
