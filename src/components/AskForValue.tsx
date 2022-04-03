import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import React, { FC, useCallback, useState } from "react";

export interface AskForValueProps {
    label: string;
    onSubmit: (value: string) => void;
}

export const AskForValue: FC<AskForValueProps> = ({ label, onSubmit }) => {
    const [value, setValue] = useState("");

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
            <TextInput value={value} onChange={setValue} onSubmit={handleSubmit} />
        </Box>
    );
};
