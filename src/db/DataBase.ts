import { Database } from "better-sqlite3";
import Container, { Constructable } from "typedi";
import { DataSource } from "typeorm";
import { BetterSqlite3ConnectionOptions } from "typeorm/driver/better-sqlite3/BetterSqlite3ConnectionOptions";
import { options } from "./ormconfig";

function prepareDatabase(db: Database) {
    db.pragma("cache=shared");
    db.pragma("read_uncommitted=true");
}

const betterOptions: BetterSqlite3ConnectionOptions = { ...options, type: "better-sqlite3", prepareDatabase };

export const dataSource = new DataSource(betterOptions);

export function DataBase() {
    return function (object: Constructable<unknown>, propertyName: string, index?: number) {
        Container.registerHandler({ object, propertyName, index, value: () => dataSource });
    };
}
