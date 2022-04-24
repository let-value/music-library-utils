import { Argument, Command } from "commander";
import { FormatterOptionsArgs } from "fast-csv";
import { Box, useStdin, useStdout } from "ink";
import SelectInput from "ink-select-input";
import { Task, TaskList } from "ink-task-list";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ComponentWithCommand, useNavigation } from "react-ink-commander";
import Container from "typedi";
import { AskForValue, formatTrackName } from "../../../components";
import { CSVRow, ExportOptions } from "../../../provider";
import { CSVStore } from "../../../store";
import { useRefFn } from "../../../utils";

const pathArgument = new Argument("[path]", "Path to output CSV file");
const command = new Command("csv")
    .description("Export to CSV file")
    .addArgument(pathArgument)
    .option("--headers", "Write headers", true)
    .option("--no-headers", "Write only data")
    .option("-l, --limit <count>", "Limit number of rows");

const ExportCSVCommand: ComponentWithCommand<ExportOptions> = observer((props) => {
    const { command, args } = props;

    const initialPath = command?.processedArgs[0] ?? args?.[0];
    const { goBack } = useNavigation();

    const abort = useRefFn(() => new AbortController());
    const [provider] = useState(() => Container.get(CSVStore));

    const { isRawModeSupported } = useStdin();
    const { stdout } = useStdout();
    const [path, setPath] = useState(initialPath);
    const mode = useMemo(() => {
        return !isRawModeSupported && stdout ? "stdin" : "file";
    }, [isRawModeSupported, stdout]);

    const options = command?.opts() as FormatterOptionsArgs<CSVRow, CSVRow>;

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
        if (mode == "stdin" && stdout) {
            provider.exportStream(stdout, props as ExportOptions, options, abort.current.signal);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stdout, mode]);

    useEffect(() => {
        if (mode == "file" && path) {
            provider.exportFile(path, props as ExportOptions, options, abort.current.signal);
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
