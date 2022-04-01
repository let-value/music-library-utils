import { Text } from "ink";
import React, { FC, useContext } from "react";
import { CommandContext } from "./CommandContext";

export const HelpPage: FC = () => {
    const { command: program } = useContext(CommandContext);

    return <Text>{program?.helpInformation()}</Text>;
};
