import { Box } from "ink";
import QuickSearchInput, { Item } from "ink-search-select";
import React, { FC, useCallback } from "react";

export interface AskSelectProps {
    label?: string;
    items: Item[];
    onSubmit: (item: Item) => void;
}

export const AskSelect: FC<AskSelectProps> = ({ label, items, onSubmit }) => {
    const handleSubmit = useCallback(
        (value) => {
            onSubmit(value);
        },
        [onSubmit]
    );

    return (
        <Box>
            <QuickSearchInput label={label} items={items} onSelect={handleSubmit} />
        </Box>
    );
};
