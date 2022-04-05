import Container, { Constructable } from "typedi";
import database from "./ormconfig";

export function DataBase() {
    return function (object: Constructable<unknown>, propertyName: string, index?: number) {
        Container.registerHandler({ object, propertyName, index, value: () => database });
    };
}
