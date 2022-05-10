import { Command } from "commander";
import { Server } from "http";
import { Text } from "ink";
import Link from "ink-link";
import Spinner from "ink-spinner";
import { AddressInfo } from "net";
import React, { useEffect, useMemo, useState } from "react";
import { ComponentWithCommand } from "react-ink-commander";
import { GoBack } from "../components";
import { createServer } from "../server/server";

const WebUICommand: ComponentWithCommand = () => {
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

    return (
        <GoBack>
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
        </GoBack>
    );
};

WebUICommand.command = new Command("webui").description("Start web UI");

export { WebUICommand };
