import { Argument, Command } from "commander";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import React, { useCallback, useState } from "react";
import { ComponentWithCommand, useNavigation } from "react-ink-commander";

const pathArgument = new Argument("[path]", "Path to CSV file");
const command = new Command("csv").description("Import CSV file").addArgument(pathArgument);

const ImportCSVCommand: ComponentWithCommand = ({ command }) => {
    const { goBack } = useNavigation();
    const [value, setValue] = useState("");
    const [file, setFile] = useState(command?.processedArgs[0]);

    const handleSubmit = useCallback((value) => {
        setFile(value);
    }, []);

    const handleBack = useCallback(() => {
        goBack();
    }, [goBack]);

    return (
        <Box flexDirection="column">
            {!file ? (
                <Box>
                    <Box marginRight={1}>
                        <Text>{pathArgument.description}:</Text>
                    </Box>
                    <TextInput value={value} onChange={setValue} onSubmit={handleSubmit} />
                </Box>
            ) : (
                <>
                    <SelectInput items={[{ key: "back", label: "Go back", value: undefined }]} onSelect={handleBack} />
                </>
            )}
        </Box>
    );
};

ImportCSVCommand.command = command;

export { ImportCSVCommand };
