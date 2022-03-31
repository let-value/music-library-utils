import Container, { Constructable } from "typedi";
import { DataSource } from "typeorm";
import { options } from "./ormconfig";

export { DataSource };

export function DataBase() {
    return function (object: Constructable<unknown>, propertyName: string, index?: number) {
        const value = new DataSource(options);
        value.initialize();

        Container.registerHandler({ object, propertyName, index, value: () => value });
    };
}
