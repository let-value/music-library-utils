import { Text } from "ink";
import React, { FC, useContext } from "react";
import { RouteContext } from "./RouteContext";

export const HelpPage: FC = () => {
    const { program } = useContext(RouteContext);

    return <Text>{program?.helpInformation()}</Text>;
};
