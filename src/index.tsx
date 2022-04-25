import { render, RenderOptions } from "ink";
import { writableNoopStream } from "noop-stream";
import React from "react";
import "reflect-metadata";
import { useContainer as rcUseContainer } from "routing-controllers";
import { Container } from "typedi";
import { App } from "./App";
import { dataSource } from "./db/DataBase";

rcUseContainer(Container);

const options: RenderOptions = {};

if (!process.stdout?.isTTY) {
    options.stdout = writableNoopStream() as NodeJS.WriteStream;
}

const { waitUntilExit } = render(<App />, options);

waitUntilExit().then(() => {
    dataSource.destroy();
});
