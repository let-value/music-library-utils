import { Box } from "ink";
import SelectInput from "ink-select-input";
import React, { FC, useCallback } from "react";
import { useNavigation } from "react-ink-commander";

export const GoBack: FC = ({ children }) => {
    const { goBack } = useNavigation();

    const handleBack = useCallback(() => {
        goBack();
    }, [goBack]);

    return (
        <Box flexDirection="column">
            {children}
            <SelectInput items={[{ key: "back", label: "Go back", value: undefined }]} onSelect={handleBack} />
        </Box>
    );
};
