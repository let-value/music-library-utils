import React from "react";
import { Command, Switch } from "../components";
import { ExportCommand } from "./export";
import { InputCommand } from "./import";

export const InputPage = () => {
    return (
        <Switch help element={<InputCommand />}>
            <Command key="export" element={<ExportCommand />} />
        </Switch>
    );
};
