import { render } from "ink";
import React from "react";
import "reflect-metadata";
import { useContainer as rcUseContainer } from "routing-controllers";
import { Container } from "typedi";
import { App } from "./App";

rcUseContainer(Container);

render(<App />);
