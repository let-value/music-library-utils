import { Argument, Command } from "commander";
import { ParserOptionsArgs } from "fast-csv";
import { Box, Text, useStdin } from "ink";
import { Item } from "ink-search-select";
import SelectInput from "ink-select-input";
import Table from "ink-table";
import { Task, TaskList } from "ink-task-list";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ComponentWithCommand, useNavigation } from "react-ink-commander";
import Container from "typedi";
import { AskForValue, AskSelect, formatTrackName } from "../../../components";
import { ProviderQuestion } from "../../../provider";
import { CSVStore } from "../../../store";
import { useRefFn } from "../../../utils";

const pathArgument = new Argument("[path]", "Path to CSV file");
const command = new Command("csv")
    .description("Import CSV file")
    .addArgument(pathArgument)
    .option("--headers", "Use first line as headers", true)
    .option("--no-headers", "Use first line as data");

const ImportCSVCommand: ComponentWithCommand = observer(({ command, args }) => {
    const initialPath = command?.processedArgs[0] ?? args?.[0];
    const { goBack } = useNavigation();

    const abort = useRefFn(() => new AbortController());
    const [provider] = useState(() => Container.get(CSVStore));

    const { stdin, isRawModeSupported } = useStdin();
    const [path, setPath] = useState(initialPath);
    const mode = useMemo(() => {
        return !isRawModeSupported && stdin ? "stdin" : "file";
    }, [isRawModeSupported, stdin]);

    const options = command?.opts() as ParserOptionsArgs;
    const headers = provider.headers?.map((header) => ({ label: header, value: header })) ?? [];

    function findColumnQuestion() {
        const questions = [provider.askArtist, provider.askAlbum, provider.askTrack, provider.askPlaylist];
        return questions.find((x) => x.isActive);
    }
    const columnQuestion = findColumnQuestion();

    const handlePath = useCallback((value) => {
        setPath(value);
    }, []);

    const handleSelectAnswer = useCallback(
        (handler: ProviderQuestion["answer"]) => (value: Item) => {
            handler?.(value?.value as string);
        },
        []
    );

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
        if (mode == "stdin" && stdin) {
            provider.importStream(stdin, options, abort.current.signal);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stdin, mode]);

    useEffect(() => {
        if (mode == "file" && path) {
            provider.importFile(path, options, abort.current.signal);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, mode]);

    const progress = (
        <TaskList>
            <Task
                isExpanded={!!provider.importResult}
                label="Importing CSV"
                status={provider.currentTrack ? formatTrackName(provider.currentTrack) : undefined}
                state={provider.importResult ? "success" : "loading"}
            >
                {provider.importResult ? (
                    <>
                        <Task label="Tracks" state="success" status={provider.importResult.tracks.length.toString()} />
                        <Task
                            label="Artists"
                            state="success"
                            status={provider.importResult.artists.length.toString()}
                        />
                        <Task label="Albums" state="success" status={provider.importResult.albums.length.toString()} />
                        <Task
                            label="Playlists"
                            state="success"
                            status={provider.importResult.playlists.length.toString()}
                        />
                    </>
                ) : undefined}
            </Task>
        </TaskList>
    );

    if (!isRawModeSupported) {
        return (
            <Box flexDirection="column">
                <Text>Reading CSV, format example:</Text>
                <Table data={provider.preview} />
                {progress}
            </Box>
        );
    }

    if (!path && mode == "file") {
        return <AskForValue label={pathArgument.description} onSubmit={handlePath} />;
    }

    if (columnQuestion?.isActive) {
        return (
            <Box flexDirection="column">
                <Table data={provider.preview} />
                <AskSelect
                    label={columnQuestion.question}
                    items={headers}
                    onSubmit={handleSelectAnswer(columnQuestion.answer.bind(columnQuestion))}
                />
            </Box>
        );
    }

    return (
        <Box flexDirection="column">
            {progress}
            <SelectInput items={[{ key: "back", label: "Go back", value: undefined }]} onSelect={handleBack} />
        </Box>
    );
}) as ComponentWithCommand;

ImportCSVCommand.command = command;

export { ImportCSVCommand };
