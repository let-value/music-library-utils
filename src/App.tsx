import React from "react";
import { InputCommand, UICommand } from "./command";
import { MainMenu } from "./command/mainMenu";
import { Command, CommandRouter, Switch } from "./components";

export const App = () => {
    return (
        <CommandRouter>
            <Switch help element={<MainMenu />}>
                <Command key="input" element={<InputCommand />} />
                <Command key="ui" element={<UICommand />} />
            </Switch>
        </CommandRouter>
    );
};
