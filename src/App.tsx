import React from "react";
import { CommandRouter, Route, Switch } from "react-ink-commander";
import { InputCommand, UICommand } from "./command";
import { MainMenu } from "./command/mainMenu";

export const App = () => {
    return (
        <CommandRouter>
            <Switch help element={<MainMenu />}>
                <Route key="input" element={<InputCommand />} />
                <Route key="ui" element={<UICommand />} />
            </Switch>
        </CommandRouter>
    );
};
