import { Command } from "commander";
import { Server } from "http";
import { Box, Newline, Text } from "ink";
import Link from "ink-link";
import SelectInput from "ink-select-input";
import Spinner from "ink-spinner";
import React, { useEffect, useMemo, useState } from "react";
import { ComponentWithCommand } from "../components";
import { createServer } from "../server/server";

const UICommand: ComponentWithCommand = () => {
    const [server, setServer] = useState<Server>();

    const address = useMemo(() => {
        if (!server) {
            return undefined;
        }
        const address = server?.address() as any;
        return `http://localhost:${address.port}/`;
    }, [server]);

    useEffect(() => {
        const server = createServer();
        setServer(server);

        return () => {
            server.close();
        };
    }, []);

    const handleBack = () => {
        console.log(server);
    };

    return (
        <Box>
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
                        <Spinner type="dots" />
                    </Text>
                    Server starting
                </Text>
            )}
            <Newline />
            <Newline />
            <SelectInput items={[{ key: "back", label: "Go back", value: undefined }]} onSelect={handleBack} />
        </Box>
    );
};

UICommand.command = new Command("ui");

export { UICommand };
