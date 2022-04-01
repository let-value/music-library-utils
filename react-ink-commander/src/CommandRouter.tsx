import React, { FC } from "react";
import { CommandContext, CommandState } from "./CommandContext";

const CommandRouter: FC = ({ children }) => {
    return <CommandContext.Provider value={undefined as unknown as CommandState}>{children}</CommandContext.Provider>;
};

CommandRouter.displayName = "CommandRouter";

export { CommandRouter };
