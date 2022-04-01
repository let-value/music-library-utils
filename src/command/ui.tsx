import { Command } from "commander";
import { Server } from "http";
import { Box, Text } from "ink";
import Link from "ink-link";
import SelectInput from "ink-select-input";
import Spinner from "ink-spinner";
import { AddressInfo } from "net";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ComponentWithCommand, useNavigation } from "react-ink-commander";
import { createServer } from "../server/server";

const UICommand: ComponentWithCommand = () => {
    const { goBack } = useNavigation();
    const [server, setServer] = useState<Server>();

    const address = useMemo(() => {
        if (!server) {
            return undefined;
        }
        const address = server?.address() as AddressInfo;
        return `http://localhost:${address.port}/`;
    }, [server]);

    useEffect(() => {
        const server = createServer();

        (async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setServer(server);
        })();

        return () => {
            server.close();
        };
    }, []);

    const handleBack = useCallback(() => {
        goBack();
    }, [goBack]);

    return (
        <Box flexDirection="column">
            {address ? (
                <Text>
                    Application:{" "}
                    <Link fallback={false} url={address}>
                        <Text color="green">{address}</Text>
                    </Link>
                </Text>
            ) : (
                <Text>
                    <Text color="green">
                        <Spinner type="dots" />{" "}
                    </Text>
                    Server starting
                </Text>
            )}
            <Text> </Text>
            <SelectInput items={[{ key: "back", label: "Go back", value: undefined }]} onSelect={handleBack} />
        </Box>
    );
};

UICommand.command = new Command("ui");

export { UICommand };
