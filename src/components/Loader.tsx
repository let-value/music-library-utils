import { Text } from "ink";
import Spinner from "ink-spinner";
import React, { FC, ReactNode } from "react";

interface Props {
    label?: ReactNode;
}

export const Loader: FC<Props> = ({ label = "Loading" }) => (
    <Text>
        <Text color="green">
            <Spinner type="dots" />{" "}
        </Text>
        {label}
    </Text>
);
