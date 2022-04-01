import Container, { Constructable } from "typedi";
import { DataSource } from "typeorm";
import { options } from "./ormconfig";

export { DataSource };

const value = new DataSource(options);

export function DataBase() {
    return function (object: Constructable<unknown>, propertyName: string, index?: number) {
        value.initialize();

        Container.registerHandler({ object, propertyName, index, value: () => value });
    };
}
