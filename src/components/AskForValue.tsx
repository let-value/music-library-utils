import { Box, Text } from "ink";
import { UncontrolledTextInput } from "ink-text-input";
import React, { FC, useCallback } from "react";

export interface AskForValueProps {
    label: string;
    onSubmit: (value: string) => void;
}

export const AskForValue: FC<AskForValueProps> = ({ label, onSubmit }) => {
    const handleSubmit = useCallback(
        (value) => {
            onSubmit(value);
        },
        [onSubmit]
    );

    return (
        <Box>
            <Box marginRight={1}>
                <Text>{label}:</Text>
            </Box>
            <UncontrolledTextInput onSubmit={handleSubmit} />
        </Box>
    );
};
