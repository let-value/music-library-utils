import React from "react";
import { ExportCommand, InputCommand } from "./command";
import { MainMenu } from "./command/mainMenu";
import { Command, Router, Switch } from "./components";

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
