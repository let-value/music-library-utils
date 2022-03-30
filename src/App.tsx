import React from "react";
import { InputCommand, UICommand } from "./command";
import { MainMenu } from "./command/mainMenu";
import { Command, Router, Switch } from "./components";

export const App = () => {
    return (
        <Router>
            <Switch help element={<MainMenu />}>
                <Command key="input" element={<InputCommand />} />
                <Command key="server" element={<UICommand />} />
            </Switch>
        </Router>
    );
};
