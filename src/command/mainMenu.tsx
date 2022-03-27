import { Command } from "commander";
import React, { useContext } from "react";
import project from "../../package.json";
import { CommandMenu, ComponentWithCommand, RouteContext } from "../components";

const MainMenu: ComponentWithCommand = () => {
    const state = useContext(RouteContext);

    const handleSelect = (command: Command) => {
        state.setPath?.(command.name());
    };

    return <CommandMenu program={state.program!} onSelect={handleSelect} />;
};

MainMenu.command = new Command(project.name).description(project.description).version(project.version);

export { MainMenu };
