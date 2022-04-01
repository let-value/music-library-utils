import React from "react";
import { Route, Switch } from "react-ink-commander";
import { ExportCommand } from "./export";
import { InputCommand } from "./import";

export const InputPage = () => {
    return (
        <Switch help element={<InputCommand />}>
            <Route key="export" element={<ExportCommand />} />
        </Switch>
    );
};
