import { render } from "ink";
import React from "react";
import "reflect-metadata";
import { useContainer as rcUseContainer } from "routing-controllers";
import { Container } from "typedi";
import { App } from "./App";
import database from "./db/ormconfig";
import { saveStdIn } from "./utils/stdin";

rcUseContainer(Container);

database
    .initialize()
    .then(() => saveStdIn())
    .then(() => render(<App />, {}))
    .then(({ waitUntilExit }) => waitUntilExit())
    .then(() => {
        database.destroy();
        console.log("Bye!");
    });
