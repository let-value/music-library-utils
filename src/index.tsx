import { render } from "ink";
import React from "react";
import "reflect-metadata";
import { useContainer as rcUseContainer } from "routing-controllers";
import { Container } from "typedi";
import { App } from "./App";
import { dataSource } from "./db/DataBase";

rcUseContainer(Container);

const { waitUntilExit } = render(<App />, {});
waitUntilExit().then(() => {
    dataSource.destroy();
    console.log("Bye!");
});
