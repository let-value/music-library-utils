import { Argument, Command } from "commander";
import { Box } from "ink";
import SelectInput from "ink-select-input";
import { Task, TaskList } from "ink-task-list";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ComponentWithCommand, useNavigation } from "react-ink-commander";
import Container from "typedi";
import { AskForValue, formatTrackName } from "../../../components";
import { ExportOptions } from "../../../provider";
import { CSVStore } from "../../../store";
import { useRefFn } from "../../../utils";

const pathArgument = new Argument("[path]", "Path to output CSV file");
const command = new Command("csv")
    .description("Export to CSV file")
    .addArgument(pathArgument)
    .option("--headers", "Write headers", true)
    .option("--no-headers", "Write only data")
    .option("-l, --limit <count>", "Limit number of rows");

interface Options {
    headers?: boolean;
    limit?: string;
}

const ExportCSVCommand: ComponentWithCommand<ExportOptions> = observer((props) => {
    const { command, args } = props;

    const initialPath = command?.processedArgs[0] ?? args?.[0];
    const { goBack } = useNavigation();

    const abort = useRefFn(() => new AbortController());
    const [provider] = useState(() => Container.get(CSVStore));

    const isRawModeSupported = useMemo(() => !!process.stdout?.isTTY, []);

    const [path, setPath] = useState(initialPath);
    const mode = useMemo(() => {
        return !isRawModeSupported ? "stream" : "file";
    }, [isRawModeSupported]);

    const options = command?.opts<Options>() ?? {};

    const parameters = useMemo((): ExportOptions => {
        return {
            ...props,
            limit: options?.limit ? parseInt(options.limit) : undefined,
        };
    }, [options.limit, props]);

    const handlePath = useCallback((value) => {
        setPath(value);
    }, []);

    const handleBack = useCallback(() => {
        goBack();
    }, [goBack]);

    useEffect(() => {
        const controller = abort.current;
        return () => {
            controller?.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (mode == "stream") {
            provider.exportStream(process.stdout, parameters, options, abort.current.signal);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    useEffect(() => {
        if (mode == "file" && path) {
            provider.exportFile(path, parameters, options, abort.current.signal);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, mode]);

    const progress = (
        <TaskList>
            <Task
                isExpanded={!!provider.importResult}
                label="Exporting CSV"
                status={provider.currentTrack ? formatTrackName(provider.currentTrack) : undefined}
                state={provider.exportResult ? "success" : "loading"}
            >
                {provider.exportResult ? (
                    <>
                        <Task label="Tracks" state="success" status={provider.exportResult.tracks.length.toString()} />
                        <Task
                            label="Artists"
                            state="success"
                            status={provider.exportResult.artists.length.toString()}
                        />
                        <Task label="Albums" state="success" status={provider.exportResult.albums.length.toString()} />
                        <Task
                            label="Playlists"
                            state="success"
                            status={provider.exportResult.playlists.length.toString()}
                        />
                    </>
                ) : undefined}
            </Task>
        </TaskList>
    );

    if (!isRawModeSupported) {
        return progress;
    }

    if (!path && mode == "file") {
        return <AskForValue label={pathArgument.description} onSubmit={handlePath} />;
    }

    return (
        <Box flexDirection="column">
            {progress}
            <SelectInput items={[{ key: "back", label: "Go back", value: undefined }]} onSelect={handleBack} />
        </Box>
    );
}) as ComponentWithCommand;

ExportCSVCommand.command = command;

export { ExportCSVCommand };
