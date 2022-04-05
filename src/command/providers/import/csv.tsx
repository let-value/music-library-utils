import { Argument, Command } from "commander";
import { ParserOptionsArgs } from "fast-csv";
import { Box, Text, useStdin } from "ink";
import { Item } from "ink-search-select";
import SelectInput from "ink-select-input";
import Table from "ink-table";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ComponentWithCommand, useNavigation } from "react-ink-commander";
import Container from "typedi";
import { AskForValue, AskSelect } from "../../../components";
import { CSVStore, ProviderQuestion } from "../../../provider";
import { stdin, useRefFn } from "../../../utils";

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

    const { isRawModeSupported } = useStdin();
    const [path, setPath] = useState(initialPath);
    const mode = useMemo(() => {
        return isRawModeSupported ? "file" : "stdin";
    }, [isRawModeSupported]);

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
        if (mode == "stdin") {
            provider.importStream(stdin.rewind(), options, abort.current.signal);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stdin, mode]);

    useEffect(() => {
        if (mode == "file" && path) {
            provider.importFile(path, options, abort.current.signal);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, mode]);

    if (!isRawModeSupported) {
        return <Text>Importing...</Text>;
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
            <SelectInput items={[{ key: "back", label: "Go back", value: undefined }]} onSelect={handleBack} />
        </Box>
    );
}) as ComponentWithCommand;

ImportCSVCommand.command = command;

export { ImportCSVCommand };
