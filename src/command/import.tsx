import { Argument, Command } from "commander";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import { Item } from "ink-select-input/build/SelectInput";
import React, { useCallback, useMemo, useState } from "react";
import { ComponentWithCommand, Route, useNavigation } from "react-ink-commander";
import { ImportCSVCommand } from "./providers/import";

const providers: ComponentWithCommand[] = [ImportCSVCommand];
const providerArgument = new Argument("[provider]", "Transfer provider").choices(
    providers.map((provider) => {
        const command = provider.command;
        return command.name();
    })
);
const command = new Command("import").description("Import to library").addArgument(providerArgument);

const ImportCommand: ComponentWithCommand = ({ command }) => {
    const { goBack } = useNavigation();

    const [provider, setProvider] = useState<ComponentWithCommand | undefined>(() => {
        const provider = providers.find((provider) => provider.command.name() === command?.processedArgs[0]);
        return provider;
    });

    const items = useMemo(() => {
        const result: Item<ComponentWithCommand | "back">[] = [];
        for (const provider of providers) {
            const command = provider.command.name();
            result.push({ key: command, label: command, value: provider });
        }
        result.push({ key: "back", label: "Back", value: "back" });
        return result;
    }, []);

    const handleSelect = useCallback(
        (option: Item<ComponentWithCommand | "back">) => {
            if (option.value == "back") {
                goBack();
            }

            if (typeof option.value !== "string") {
                setProvider(option.value);
            }
        },
        [goBack]
    );

    const Provider = provider;

    return (
        <Box flexDirection="column">
            <Text>Import</Text>
            {!provider ? (
                <>
                    <Box marginBottom={1}>
                        <Text>Select provider:</Text>
                    </Box>
                    <SelectInput items={items} onSelect={handleSelect} />
                </>
            ) : undefined}
            {Provider ? () => <Route element={<Provider />} /> : undefined}
        </Box>
    );
};

ImportCommand.command = command;

export { ImportCommand };
