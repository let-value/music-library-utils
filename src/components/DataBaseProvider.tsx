import { Text } from "ink";
import Spinner from "ink-spinner";
import React, { FC, useEffect, useState } from "react";
import { dataSource } from "../db";

export const DataBaseProvider: FC = ({ children }) => {
    const [ready, setReady] = useState(dataSource.isInitialized);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!ready) {
            setLoading(true);
            dataSource.initialize().then(() => {
                setLoading(false);
                setReady(true);
            });
        }
    }, [ready]);

    if (loading) {
        return (
            <Text>
                <Text color="green">
                    <Spinner type="dots" />{" "}
                </Text>
                Initializing database
            </Text>
        );
    }

    if (!ready) {
        return <Text>DB is not ready</Text>;
    }

    return <>{children}</>;
};
