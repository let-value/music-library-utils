import React, { FC } from "react";
import { CommandContext, CommandState } from "./CommandContext";

export const CommandRouter: FC = ({ children }) => {
    return <CommandContext.Provider value={undefined as unknown as CommandState}>{children}</CommandContext.Provider>;
};
