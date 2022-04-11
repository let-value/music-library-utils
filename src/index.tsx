import { render } from "ink";
import React from "react";
import "reflect-metadata";
import { useContainer as rcUseContainer } from "routing-controllers";
import { Container } from "typedi";
import { App } from "./App";
import database from "./db/ormconfig";

rcUseContainer(Container);

const { waitUntilExit } = render(<App />, {});
waitUntilExit().then(() => {
    database.destroy();
    console.log("Bye!");
});
