import React from "react";
import { ExportCommand, InputCommand } from "./cli/command";
import { MainMenu } from "./cli/command/mainMenu";
import { Command, Router, Switch } from "./cli/components";

export const App = () => {
    return (
        <Router>
            <Switch help element={<MainMenu />}>
                <Command key="input" element={<InputCommand />} />
                <Command key="output" element={<ExportCommand />} />
            </Switch>
        </Router>
    );
};
